/**
 *
 * @authors dzw
 * @date    2020/12/10
 * @description
 */
var MIME_SUPPORT_GZIP = {
    jpg: false,
    mp3: false,
    png: false,
    skel: true,
    atlas: true,
    json: true,
    plist: true,
    txt: true,
};

 //和打包配置配对存在，不可删除
var mergeJsonMd5 = "md5"

var hookDownLoad = function () {
    var downloader = cc.assetManager.downloader;
    var need_decompress_gzip = true;
    var _window$fsUtils = window.fsUtils,
        getUserDataPath = _window$fsUtils.getUserDataPath,
        readJson = _window$fsUtils.readJson,
        readText = _window$fsUtils.readText,
        downloadFile = _window$fsUtils.downloadFile;

    var cacheManager = cc.assetManager.cacheManager;

    var subpackages = {},
        remoteBundles = {};

    var isSubDomain = __globalAdapter.isSubContext;

    //gzip是否可用
    function isGzipEnable (url) {

        var request_gzip = false;
        var indexOf = url.lastIndexOf(".");
        if (indexOf != -1) {
            var ext = url.substr(indexOf + 1);
            request_gzip = MIME_SUPPORT_GZIP[ext] == undefined ? false : MIME_SUPPORT_GZIP[ext];
        }
        return request_gzip;
    }

    _window$fsUtils.downloadFile = function (remoteUrl, filePath, header, onProgress, onComplete) {
        //var self = this;
        var request_gzip = isGzipEnable(remoteUrl);
        var options = {
            url: remoteUrl,
            success: function (res) {
                var downloadTempPath = res.tempFilePath || res.filePath;
                if (res.statusCode === 200) {
                    if (request_gzip) {
                        wx.getFileSystemManager().readFile({
                            filePath: downloadTempPath,
                            success: function(result) {
                                var fileBuffer = result.data;
                                var uint8Array = new Uint8Array(fileBuffer);

                                if (need_decompress_gzip) {
                                    try {
                                        var fileBuffer = cc.codec.unzip(uint8Array);
                                    } catch (e) {
                                        need_decompress_gzip = false;//系统已经支持不再需要自己解压
                                        console.warn("gzip解压失败", e);
                                    }
                                }

                                _window$fsUtils.writeFile(downloadTempPath, fileBuffer, "binary", function(msg){
                                    if (!msg) {
                                        console.log("成功写入文件")
                                        onComplete && onComplete(null, res.tempFilePath || res.filePath);
                                    }else{
                                        console.warn("文件下载 解压写入 失败:", msg);
                                    }
                                })
                            },
                            fail: function (res) {
                                console.warn("文件下载 解压读取 失败:" + res.errMsg);
                            }
                        });
                    }
                    else{
                        onComplete && onComplete(null, res.tempFilePath || res.filePath);
                    }
                }
                else {
                    if (res.filePath) {
                        _window$fsUtils.deleteFile(res.filePath);
                    }
                    console.warn(`Download file failed: path: ${remoteUrl} message: ${res.statusCode}`);
                    onComplete && onComplete(new Error(res.statusCode), null);
                }
            },
            fail: function (res) {
                console.warn(`Download file failed: path: ${remoteUrl} message: ${res.errMsg}`);
                onComplete && onComplete(new Error(res.errMsg), null);
            }
        }

        if (filePath) options.filePath = filePath;
        if (request_gzip) options.header = {"Accept-Encoding": "gzip"};
        if (header) options.header = header;
        var task = wx.downloadFile(options);
        onProgress && task.onProgressUpdate(onProgress);
    }


    function downloadScript(url, options, onComplete) {
        if (typeof options === 'function') {
            onComplete = options;
            options = null;
        }

        if (REGEX.test(url)) {
            onComplete && onComplete(new Error('Can not load remote scripts'));
        }
        else {
            __cocos_require__(url);

            onComplete && onComplete(null);
        }
    }

    function handleZip(url, options, onComplete) {
        var cachedUnzip = cacheManager.cachedFiles.get(url);

        if (cachedUnzip) {
            cacheManager.updateLastTime(url);
            onComplete && onComplete(null, cachedUnzip.url);
        }
        else if (REGEX.test(url)) {
            downloadFile(url, null, options.header, options.onFileProgress, function (err, downloadedZipPath) {
                if (err) {
                    onComplete && onComplete(err);
                    return;
                }

                cacheManager.unzipAndCacheBundle(url, downloadedZipPath, options.__cacheBundleRoot__, onComplete);
            });
        }
        else {
            cacheManager.unzipAndCacheBundle(url, url, options.__cacheBundleRoot__, onComplete);
        }
    }

    function downloadBundle(nameOrUrl, options, onComplete) {
        var bundleName = cc.path.basename(nameOrUrl);
        var version = options.version || cc.assetManager.downloader.bundleVers[bundleName];

        if (subpackages[bundleName]) {
            var config = "subpackages/".concat(bundleName, "/config.").concat(version ? version + '.' : '', "json");
            loadSubpackage(bundleName, options.onFileProgress, function (err) {
                if (err) {
                    onComplete(err, null);
                    return;
                }

                downloadJson(config, options, function (err, data) {
                    data && (data.base = "subpackages/".concat(bundleName, "/"));
                    onComplete(err, data);
                });
            });
        }
        else {
            var js, url;

            if (REGEX.test(nameOrUrl) || !isSubDomain && nameOrUrl.startsWith(getUserDataPath())) {
                url = nameOrUrl;
                js = "src/scripts/".concat(bundleName, "/index.js");
                cacheManager.makeBundleFolder(bundleName);
            }
            else {
                if (remoteBundles[bundleName]) {
                    url = "".concat(REMOTE_SERVER_ROOT, "remote/").concat(bundleName);
                    js = "src/scripts/".concat(bundleName, "/index.js");
                    cacheManager.makeBundleFolder(bundleName);
                }
                else {
                    url = "assets/".concat(bundleName);
                    js = "assets/".concat(bundleName, "/index.js");
                }
            }

            __cocos_require__(js);

            options.__cacheBundleRoot__ = bundleName;
            var config = "".concat(url, "/config.").concat(version ? version + '.' : '', "json");
            downloadJson(config, options, function (err, data) {
                if (err) {
                    onComplete && onComplete(err);
                    return;
                }

                if (data.isZip) {
                    var zipVersion = data.zipVersion;
                    var zipUrl = "".concat(url, "/res.").concat(zipVersion ? zipVersion + '.' : '', "zip");
                    handleZip(zipUrl, options, function (err, unzipPath) {
                        if (err) {
                            onComplete && onComplete(err);
                            return;
                        }

                        data.base = unzipPath + '/res/'; // PATCH: for android alipay version before v10.1.95 (v10.1.95 included)
                        // to remove in the future

                        var sys = cc.sys;

                        if (sys.platform === sys.ALIPAY_GAME && sys.os === sys.OS_ANDROID) {
                            var resPath = unzipPath + 'res/';

                            if (fs.accessSync({
                                path: resPath
                            })) {
                                data.base = resPath;
                            }
                        }

                        onComplete && onComplete(null, data);
                    });
                }
                else {
                    data.base = url + '/';
                    onComplete && onComplete(null, data);
                }
            });
        }
    }

    function parseText(url, options, onComplete) {
        readText(url, onComplete);
    }

    function parseJson(url, options, onComplete) {
        readJson(url, onComplete);
    }

    function doNothing(content, options, onComplete) {
        fsUtils.exists(content, (existence) => {
            if (existence) {
                onComplete(null, content);
            } else {
                onComplete(new Error(`file ${content} does not exist!`));
            }
        });
    }

    function downloadAsset(url, options, onComplete) {
        download(url, doNothing, options, options.onFileProgress, onComplete);
    }

    function downloadText(url, options, onComplete) {
        console.log("---- download text : " + url);
        download(url, parseText, options, options.onFileProgress, onComplete);
    }

    var regExp = new RegExp("assets/.*/import/[0-9a-f]{2}/([0-9a-f-]+)\.[0-9a-f]{5}\.json");
    var downloadJson = function (url, options, onComplete) {
        var regExpExecArray;
        if (window.mergeJson == undefined || (regExpExecArray = regExp.exec(url)) == null) {
            download(url, parseJson, options, options.onFileProgress, onComplete);
        }
        else {
            var guid = regExpExecArray[1];
            var jsonContent = mergeJson[guid];
            if (jsonContent)
                onComplete(null, JSON.parse(jsonContent));
            else
                download(url, parseJson, options, options.onFileProgress, onComplete);
        }
    };
    var downloadImage = downloadAsset;

    const REGEX = /^https?:\/\/.*/;
    var transformUrl = function (url, options) {
        var inLocal = false;
        var inCache = false;
        var isInUserDataPath = url.startsWith(getUserDataPath());
        if (isInUserDataPath) {
            inLocal = true;
        }
        else if (REGEX.test(url)) {
            var cacheUrl = url;
            if (url.startsWith(REMOTE_SERVER_ROOT))
                cacheUrl = url.substr(REMOTE_SERVER_ROOT.length);
            if (!options.reload) {
                var cache = cacheManager.cachedFiles.get(cacheUrl);
                if (cache) {
                    inCache = true;
                    url = cache.url;
                }
                else {
                    var tempUrl = cacheManager.tempFiles.get(cacheUrl);
                    if (tempUrl) {
                        inLocal = true;
                        url = tempUrl;
                    }
                }
            }
        }
        else {
            inLocal = true;
        }
        return {url, inLocal, inCache};
    };

    function download(url, func, options, onFileProgress, onComplete) {

        var downloadUrl = url;

        function isInternal() {
            return url.startsWith("assets/internal/")
                || url.startsWith("assets/main/config.");
        }

        if (url.startsWith("assets/")) {
            if (!isInternal()) {
                downloadUrl = REMOTE_SERVER_ROOT + url;
            }
        }

        var result = transformUrl(downloadUrl, options);
        var localUrl = result.url;
        if (result.inLocal) {
            func(localUrl, options, onComplete);
        }
        else if (result.inCache) {
            cacheManager.updateLastTime(url);
            func(localUrl, options, function (err, data) {
                if (err) {
                    cacheManager.removeCache(url);
                }
                onComplete(err, data);
            });
        }
        else {
            downloadFile(downloadUrl, null, options.header, onFileProgress, function (err, path) {
                if (err) {
                    onComplete(err, null);
                    return;
                }
                func(path, options, function (err, data) {
                    if (!err) {
                        cacheManager.tempFiles.add(url, path);
                        cacheManager.cacheFile(url, path, options.cacheEnabled, options.__cacheBundleRoot__, true);
                    }
                    onComplete(err, data);
                });
            });
        }
    }

    downloader.register({
        '.js': downloadScript,
        // Audio
        '.mp3': downloadAsset,
        '.ogg': downloadAsset,
        '.wav': downloadAsset,
        '.m4a': downloadAsset,

        // Image
        '.png': downloadImage,
        '.jpg': downloadImage,
        '.bmp': downloadImage,
        '.jpeg': downloadImage,
        '.gif': downloadImage,
        '.ico': downloadImage,
        '.tiff': downloadImage,
        '.image': downloadImage,
        '.webp': downloadImage,
        '.pvr': downloadAsset,
        '.pkm': downloadAsset,

        '.font': downloadAsset,
        '.eot': downloadAsset,
        '.ttf': downloadAsset,
        '.woff': downloadAsset,
        '.svg': downloadAsset,
        '.ttc': downloadAsset,

        // Txt
        '.txt': downloadAsset,
        '.xml': downloadAsset,
        '.vsh': downloadAsset,
        '.fsh': downloadAsset,
        '.atlas': downloadAsset,

        '.tmx': downloadAsset,
        '.tsx': downloadAsset,
        '.plist': downloadAsset,
        '.fnt': downloadAsset,

        '.json': downloadJson,
        '.ExportJson': downloadAsset,

        '.binary': downloadAsset,
        '.bin': downloadAsset,
        '.dbbin': downloadAsset,
        '.skel': downloadAsset,

        '.mp4': downloadAsset,
        '.avi': downloadAsset,
        '.mov': downloadAsset,
        '.mpg': downloadAsset,
        '.mpeg': downloadAsset,
        '.rm': downloadAsset,
        '.rmvb': downloadAsset,

        'bundle': downloadBundle,

        'default': downloadText,
    });
};
window.hookDownLoad = hookDownLoad;

window.wxDownloader = {
    loadMergeJson: function (callback) {
        var _window$fsUtils = window.fsUtils;
        var mergeJsonName = "MergeJson.json"
        var url = REMOTE_SERVER_ROOT + 'assets/' + mergeJsonName;
        var onComplete = function (err, rspd) {
            if (err) {
                console.log("下载MergeJson.json失败：",err)
                callback(err);
            }else {
                console.log("成功获取 MergeJson.json, 路径：", rspd);
                _window$fsUtils.readJson(rspd, function (err, out) {
                    if (err) {
                        // 解析 json 失败，需要删除 json 文件，并返回错误
                        console.log("解析 MergeJson.json 失败", err);
                        _window$fsUtils.deleteFile(rspd);
                        callback(err);
                        return;
                    }
                    console.log("解析 MergeJson.json 成功");
                    window.mergeJson = out;
                    callback(null);
                })
            }
        };

        if (mergeJsonMd5 == "md5") {
            console.error("mergeJsonMd5 必现是一个完整md5值， 检查打包工具！")
            return;
        };

        var tmpFilePath = _window$fsUtils.getUserDataPath() + "/" + mergeJsonName;
        console.log("local file path =", tmpFilePath);
        _window$fsUtils.exists(tmpFilePath, function(flag){
            if (flag) {
                wx.getFileSystemManager().getFileInfo({
                    filePath: tmpFilePath,
                    digestAlgorithm: "md5",
                    success: function (res){
                        console.log("打包时记录的 md5 : " + mergeJsonMd5);
                        console.log("本地文件的 md5 : " + res.digest);
                        if (res.digest != mergeJsonMd5) {
                            console.log("md5 不相等 重新下载")
                            _window$fsUtils.downloadFile(url, tmpFilePath, null, null, onComplete);
                        }
                        else{
                            console.log("md5 相等直接解析")
                            onComplete(null, tmpFilePath);
                        }
                    },
                    fail: function(res) {
                        console.log("获取mergeJson 信息失败重新下载")
                        _window$fsUtils.downloadFile(url, tmpFilePath, null, null, onComplete);
                    }
                })
            }else{
                console.log("下载mergeJson : " + url);
                _window$fsUtils.downloadFile(url, tmpFilePath, null, null, onComplete);
            }
        })
    },

    cleanAllCaches: function () {
        cc.assetManager.cacheManager.clearCache();
    }
};