(function() {
    var cls = cc.Class({
        ctor() {
            this.CHECK_VERSION_TIMEOUT = 15 // 版本检查的超时时间，单位：秒
            this.STATE_ERROR = -1
            this.STATE_LATEST = 0 // 最新版本,无需升级
            this.STATE_MAINTAIN = 9 // 正在维护,此时msg键中存的是维护提示内容,请将其显示给用户
            this.STATE_UPDATE = 11 // 需要更新
            this.UPDATE_TYPE_HOT = 1 // 热更新
            this.UPDATE_TYPE_PACK = 2 // 整包更新

            this._reqQueue = []
            this.VersionData = {}
        },

        checkVersion: function (loginUrl, callback) {
            this._cancelRequest();
            var url = this.getCheckUrl(loginUrl);
            console.log("--------local time : ", (new Date()).toLocaleString());
            console.log("--------checkVersion :", url);
            this.httpGetJs(url, callback);
        },

        getCheckUrl: function (loginUrl) {
            var url = LOGIN_SERVER
            if (loginUrl) {
                url = loginUrl
                url += Device.getDeviceCode();
                url += "/" + "0";
            }
            else{
                url += "/versionsvr/checkapp";
                url += "/" + checkint(APP_ID);
                url += "/" + checkint(CHANNEL_ID);
                url += "/" + APP_VERSION.join('.');
                url += "/" + Device.getDeviceCode();
                url += "/" + "0";
            }

            return url;
        },

        httpGetJs: function (url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.timeout = this.CHECK_VERSION_TIMEOUT * 1000;
            xhr.callback = callback;
            var params = {
                format: "json",
                share: 0,
                ver: 2,
            };
            if (!isNative() || !this.NATIVE_ENABLE_ENCRYPT) {
                params.show = "xdh";
            }
            var data = CommHttp.joinParams(params);
            CommHttp.setHttpHostCache(url)

            cc.log("---- check version url : " + url + "?" + data);
            xhr.open("GET", url + "?" + data);

            var startTime = Date.now();
            xhr.onreadystatechange = function () {
                //cc.log(xhr.readyState, xhr.status);
                if (xhr.readyState != 4) {
                    return;
                }
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 207) {
                        if (xhr.callback == undefined) {
                            return;
                        }
                        var dataStr = xhr.responseText;
                        //cc.log("check:check version = %s", dataStr);
                        this.VersionData = this.handle_version_data_(dataStr);
                        this.VersionData.status = this.get_ver_state_();

                        cc.log("check:callback the data to game app");
                        xhr.callback(this.VersionData.status, this.VersionData);
                        this._cancelRequest();
                    } else {
                        if (xhr.callback) {
                            cc.log("error", xhr.readyState, xhr.status);
                            xhr.callback(-1, "check error")
                        }
                    }
                }
            }.bind(this);

            xhr.onerror = function (event) {
                cc.log("check: error", event);
                this._onRequestFailed(xhr);
            }.bind(this);

            xhr.ontimeout = function () {
                cc.log("check: timeout");
                this._onRequestFailed(xhr);
            }.bind(this);
            xhr.send();
            this._reqQueue.push(xhr);
            return xhr;
        },

        // 获取版本状态
        get_ver_state_: function () {
            if (this.VersionData) {
                // 修改大厅版本更新字段status为code
                // return checknumber(this.VersionData.status, undefined, -1);
                return checknumber(this.VersionData.code, undefined, -1);
            } else {
                return -1;
            }
        },

        handle_version_data_: function (responseText) {
            console.log("handle_version_data_:"+responseText);
            if (isNative() && responseText.length > 0) {
                for (var i = 0; i < Math.ceil(responseText.length/1000); i++) {
                    var idx = 1000 * (i + 1)
                    if (i == (Math.floor(responseText.length/1000))) {
                        idx = 1000 *i + responseText.length%1000
                    }
                    console.log(responseText.substr(i*1000, idx))
                }
            };
            var data = checktable(JSON.parse(responseText || ""));
            if (!isNative()) console.log(data);
            //审核模式
            if (data.review) {
                // 有 review 字段，使用之
                IS_REVIEW_MODE = checkint(data.review) === 1;
            }

            // gong neng kai guan
            if(data.switch){
                cc.ResetSwitch(data.switch)
            }
            ChannelHelper.applyChannelSwitch();

            //zhi fu kai guan
            if (data.spay || data.spay == 0) {
                PAY_SWITCH = data.spay;
            }

            // user API 对应的 web 接口域名
            USER_API_DOMAIN = data.api_domain;

            //通知域名
            NOTIFY_DOMAIN = data.notify_domain;
            NOTIFY_ADDR = data.notify_addr

            if (data.mp && data.mp.length > 0) {
                MP_NAME = data.mp;
            }

            // iOS 显示计费点需要的发炮数
            if (data.need_sc && data.need_sc > 0) {
                window.NEED_SHOOT_COUNT = data.need_sc;
            }

            if (window.FishNativeRemoteDownloader && data.current_url) {
                var remoteUrl = data.current_url;
                // 当前属于大版本更新转用hot_url
                if (cc.path.extname(data.current_url) == '.apk') {
                    remoteUrl = data.hot_url;
                }
                FishNativeRemoteDownloader.setRemoteUrl(this.calcValidUrl(remoteUrl));
            }

            // 热更地址
            var updateUrl = data.url;
            if (isNative() && updateUrl) {
                var urlRegExp = new RegExp("^(?:https?|ftp)://\\S*$", "i");
                updateUrl = cc.path.dirname(updateUrl)
                if (updateUrl.length > 0) {
                    var ch = updateUrl.sub(updateUrl.length - 1, 1);
                    if (ch != "/") {
                        updateUrl += "/";
                    }
                }
                if (!urlRegExp.test(updateUrl)) {
                    updateUrl = ""
                }
            } else {
                updateUrl = "";
            }
            window.HOT_UPDATE_URL = updateUrl;
            //console.log("updateUrl", updateUrl)
            return data;
        },

        calcValidUrl: function(updateUrl) {
            var urlRegExp = new RegExp("^(?:https?|ftp)://\\S*$", "i");
            updateUrl = cc.path.dirname(updateUrl)
            if (updateUrl.length > 0) {
                var ch = updateUrl.sub(updateUrl.length - 1, 1);
                if (ch != "/") {
                    updateUrl += "/";
                }
            }
            if (!urlRegExp.test(updateUrl)) {
                updateUrl = ""
            }
            return updateUrl;
        },

        _onRequestFailed: function (xhr) {
            for (var i = 0; i < this._reqQueue.length; i++) {
                if (this._reqQueue[i] === xhr) {
                    this._reqQueue.splice(i, 1);
                }
            }

            if (this._reqQueue.length == 0) {
                this.VersionData = {};
                if (xhr.callback) {
                    xhr.callback(-1);
                }
            }
        },

        _cancelRequest: function () {
            if (this._reqQueue && this._reqQueue.length > 0) {
                for (var i = 0; i < this._reqQueue.length; i++) {
                    this._reqQueue[i].abort();
                }
            }
            this._reqQueue = [];
        },
        // update (dt) {},
    });
    var helper = new cls();
    window.VersionHelper = helper;
})();