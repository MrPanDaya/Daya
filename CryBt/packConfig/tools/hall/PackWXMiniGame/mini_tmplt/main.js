"use strict";
require("hooks");
hookDownLoad();

window.boot = function() {
    var settings = window._CCSettings;
    var remoteUrlList = [];
    var remoteUrlIdx = 0;
    window._CCSettings = undefined;

    // 创建启动场景
    var createLaunchScene = function() {
        console.log("创建启动场景");
        var scene = new cc.Scene();
        // 1. Add canvas component
        var root = new cc.Node();
        root.addComponent(cc.Canvas);
        root.parent = scene;

        var canvas = root.getComponent(cc.Canvas);
        canvas.designResolution = cc.size(1280, 720);
        var width = cc.winSize.width;
        var height = cc.winSize.height;
        var factor = width > height ? width / height : height / width;
        var maxFactor = 16.0 / 9.0 + 0.01;

        // 2. Add sprite component
        var bgSprite = root.addComponent(cc.Sprite);
        var createImage = function(sprite, url) {
            if (cc.sys.platform == cc.sys.WECHAT_GAME) {
                let image = wx.createImage();
                image.onload = function() {
                    var maxScale = Math.max(cc.winSize.width / image.width, cc.winSize.height / image.height);
                    if (factor > maxFactor) {
                        canvas.fitHeight = true;
                        canvas.fitWidth = false;
                        console.log("fit with height");
                    }
                    else {
                        canvas.fitHeight = false;
                        canvas.fitWidth = true;
                        console.log("fit with width");
                        maxScale = factor;
                    }
                    root.scale = maxScale;

                    let texture = new cc.Texture2D();
                    texture.initWithElement(image);
                    texture.handleLoadedTexture();
                    sprite.spriteFrame = new cc.SpriteFrame(texture);
                };
                image.src = url;
            }
        };
        createImage(bgSprite, "launch.jpg");
        cc.director.runSceneImmediate(scene);
    };
    // 下载md5文件列表
    var downloadMd5Map = function(url, callback) {
        console.log("下载md5文件列表", url);
        window.wx.downloadFile({
            url: url,
            success: function(res) {
                var fs = wx.getFileSystemManager ? wx.getFileSystemManager() : null;
                fs.readFile({
                    filePath: res.tempFilePath,
                    encoding: 'utf8',
                    success: function(res) {
                        callback(res.data);
                    },
                    fail: function fail(res) {
                        callback(null, res.errMsg);
                    }
                });
            },
            fail: function(res) {
                callback(null, res.errMsg);
            },
        });
    };

    // remoteUrlList, remoteUrlIdx
    // 下载mergejson
    var downloadMergeJson = function(calllback) {
        console.log("-----------remoteUrlIdx = ", remoteUrlIdx);
        wxDownloader.loadMergeJson(function(err) {
            if (err) {
                console.log("downloadMergeJson :", err);
                if (remoteUrlIdx >= remoteUrlList.length) {
                    remoteUrlIdx = 0;
                    handleLaunchError('启动游戏失败');
                }
                else{
                    window.REMOTE_SERVER_ROOT = window.LOGIN_SERVER;
                    remoteUrlIdx++;
                    downloadMergeJson(calllback);
                }
                return;
            }
            calllback();
        });
    };
    var handleLaunchError = function(content, bClean) {
        wx.showModal({
            title: "提示",
            content: content,
            showCancel: false,
            success: function() {
                if (bClean) {
                    wxDownloader.cleanAllCaches();
                }
                window.wx.exitMiniProgram({});
            }
        });
    };

    var checkverError = function(content) {
        wx.showModal({
            title: "提示",
            content: content,
            cancelText: "退出",
            confirmText: "重试",
            success: function(res) {
                if (res.confirm) {
                    // 重试
                    doCheckVersion();
                    return;
                }

                // 退出小游戏
                window.wx.exitMiniProgram({});
            }
        });
    };

    // 算出资源服地址
    var calcResourseUrl = function(url) {
        // 热更地址
        var urlRegExp = new RegExp("^(?:https?|ftp)://\\S*$", "i");
        if (!urlRegExp.test(url)) {
            url = "";
        }
        else {
            url = cc.path.dirname(url) + '/';
        }

        if (!window.REMOTE_SERVER_ROOT) {
            remoteUrlList.push(url);
            var r = Math.floor(Math.random() * 100000);
            for (var i = 0; i < 3; i++) {
                var rep = "file-fish" + i;
                remoteUrlList.push(url.replace('file-fish', rep));
            }

            var idx = r % (remoteUrlList.length);
            url = remoteUrlList[idx];
        }

        console.log("算出资源服地址", url);
        return url;
    };

    var initLogger = function() {
        // 关闭log
        if (window.LOG_LEVEL != null && window.LOG_LEVEL == 0) {
            var logger = wx.getLogManager();
            console.log = cc.log = function() {
                logger && logger.log.apply(null, arguments);
            };
            cc.warn = function() {
                logger && logger.warn.apply(null, arguments);
            };
            console.error = cc.error = function() {
                logger && logger.log.apply(null, arguments);
            };
            cc.assert = function(cond, msg) {
                if (!cond) {
                    logger && logger.log("[Assert failed]" + msg);
                }
            };
        } else {
            cc.log = console.log;
        }
    }

    function startFirstScene() {
        var launchScene = settings.launchScene; // load scene

        window.CURRENT_SCENE_NAME = "login";
        cc.director.loadScene(launchScene, null, function() {
            console.log('Success to load scene: ' + launchScene);
        });
    }

    function startSceneAfterLoadBundle() {
        function cb(err) {
            startFirstScene();
        }

        if (settings.hasResourcesBundle) {
            var bundleRoot = [RESOURCES];
            for (var i = 0; i < bundleRoot.length; i++) {
                cc.assetManager.loadBundle(bundleRoot[i], cb);
            }
        }
    }

    var doCheckVersion = function() {
        let onVersionCheckFun = function(state, resp) {
            console.log("版本检查 state: ", state);
            var helper = window.VersionHelper;
            var errorMsg;
            var needRetry = false;
            switch (state) {
                case helper.STATE_ERROR:
                    errorMsg = "版本检查失败，请重试";
                    needRetry = true;
                    break;
                case helper.STATE_LATEST:
                    break;
                case helper.STATE_MAINTAIN:
                    errorMsg = "正在维护中,请官网关注公告！";
                    break;
                case helper.STATE_UPDATE:
                    break;
                default:
                    if (resp.status == 120) {
                        errorMsg = "版本错误：请确保 Web 后台有本产品的对应版本，并且不是”开发中”状态";
                    } else {
                        needRetry = true;
                    }
                    errorMsg = resp ? resp.msg : undefined;
                    if (errorMsg === undefined) {
                        errorMsg = "版本检查失败,请重新启动";
                    }
                    break;
            }

            //errorMsg = "test"
            if (errorMsg) {
                if (needRetry) {
                    if (!window.USING_BACKUP_DOMAIN && window.BACKUP_LOGIN_SERVER) {
                        // 没有使用备用域名，且有配置备用域名，自动重试。
                        window.LOGIN_SERVER = window.BACKUP_LOGIN_SERVER;
                        window.USING_BACKUP_DOMAIN = true;
                        cc.log("---- use backup domain : ", window.BACKUP_LOGIN_SERVER);
                        doCheckVersion();
                        return;
                    }

                    // 弹窗提示重试
                    checkverError(errorMsg);
                } else {
                    handleLaunchError(errorMsg);
                }
                return;
            }
            if (!window.REMOTE_SERVER_ROOT || window.REMOTE_SERVER_ROOT == "") {
                let remoteserverroot = calcResourseUrl(resp.current_url);
                window.REMOTE_SERVER_ROOT = remoteserverroot;
            }
            downloadMergeJson(function() {
                startSceneAfterLoadBundle();
            });
        };
        VersionHelper.checkVersion(null, onVersionCheckFun);
    }

    var onStart = function onStart() {
        window.REMOTE_SERVER_ROOT = window.LOGIN_SERVER;
        initLogger();
        cc.view.enableRetina(true);
        cc.view.resizeWithBrowserSize(true);
        createLaunchScene();

        if (window.MiniGame_BIG_UPDATE) {
            var version = APP_VERSION.join('.');
            if (cc.sys.localStorage.getItem("MiniGame_BIG_UPDATE", "") != version) {
                cc.sys.localStorage.setItem("MiniGame_BIG_UPDATE", version);
                console.log("---- 大版本升级，清理之前版本的缓存 ----");
                wxDownloader.cleanAllCaches();
            }
        }

        // 版本检查
        if (!window.VersionHelper) {
            startFirstScene();
            return;
        }

        console.log("开始版本检查");
        // doCheckVersion();
        downloadMergeJson(function() {
            startSceneAfterLoadBundle();
        });
    };

    var isSubContext = cc.sys.platform === cc.sys.WECHAT_GAME_SUB;
    var option = {
        id: 'GameCanvas',
        debugMode: window.LOG_LEVEL == 1 ? cc.debug.DebugMode.INFO : cc.debug.DebugMode.ERROR,
        showFPS: !isSubContext && settings.debug,
        frameRate: 60,
        groupList: settings.groupList,
        collisionMatrix: settings.collisionMatrix
    };
    cc.assetManager.init({
        bundleVers: settings.bundleVers,
        subpackages: settings.subpackages,
        remoteBundles: settings.remoteBundles,
        server: settings.server,
        subContextRoot: settings.subContextRoot
    });
    var RESOURCES = cc.AssetManager.BuiltinBundleName.RESOURCES;
    var INTERNAL = cc.AssetManager.BuiltinBundleName.INTERNAL;
    var MAIN = cc.AssetManager.BuiltinBundleName.MAIN;
    var START_SCENE = cc.AssetManager.BuiltinBundleName.START_SCENE;
    var bundleRoot = [INTERNAL];
    settings.hasStartSceneBundle && bundleRoot.push(MAIN);
    var count = 0;

    function cb(err) {
        if (err) return console.error(err.message, err.stack);
        count++;

        if (count === bundleRoot.length + 1) {
            // if there is start-scene bundle. should load start-scene bundle in the last stage
            // Otherwise the main bundle should be the last
            cc.assetManager.loadBundle(settings.hasStartSceneBundle ? START_SCENE : MAIN, function(err) {
                if (!err) cc.game.run(option, onStart);
            });
        }
    } // load plugins


    cc.assetManager.loadScript(settings.jsList.map(function(x) {
        return 'src/' + x;
    }), cb); // load bundles

    for (var i = 0; i < bundleRoot.length; i++) {
        cc.assetManager.loadBundle(bundleRoot[i], cb);
    }
};
