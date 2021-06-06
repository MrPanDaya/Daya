/*
 * @Author: honghui.zhang
 * @Date: 2018-05-22 11:17:45
 * @Last Modified by: honghui.zhang
 * @Last Modified time: 2019-04-09 16:09:12
 */
"use strict"

window.CommHttp =
{
    /**
     * Http Get 请求，不支持加密
     *
     * @param {string} url 请求地址
     * @param {function} callback 回调函数
     * @param {int} timeout 超时时间(毫秒)
     * @param {object} headers 请求头
     * @param {boolean} noFormat 是否添加响应格式（默认为json）
     */
    get : function(url, callback, timeout, headers, params) {
        var xhr = new XMLHttpRequest();
        xhr.timeout = timeout || 5000;

        if(params.length > 0){
            url += "?" + params[0];
            for(var i = 1; i < params.length; ++i){
                url += "&" + params[i];
            }
        }

        xhr.open("GET", url, true);
        cc.log(url);

        if (headers) {
            for (var key in headers) {
                if(headers.hasOwnProperty(key))
                    xhr.setRequestHeader(key, headers[key]);
            }
        }

        xhr.onreadystatechange = function () {

            if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status <= 401) {
                // try {
                    if (callback !== undefined) {
                        callback(xhr.status, xhr.responseText);
                    }
                // } catch (e) {
                //     error("err:" + e);
                // } finally {

                // }
            }
            else
            {
                if (xhr.readyState === 4 && xhr.status !== 200)
                {
                    if (callback !== undefined) {
                        var errorInfo = cc.formatStr(
                            "错误提示：HTTP get onreadystatechange: url(%s) status(%s) responseText(%s)",
                            url, xhr.status, xhr.responseText);

                        callback(xhr.status, {"msg" : errorInfo});
                    }
                }
            }
        };

        xhr.onerror = function(err) {
            var errMsg = cc.formatStr(
                "错误提示：HTTP get Request onerror: url(%s) errorMsg(%s)",
                url, JSON.stringify(err));

                cc.error(errMsg);

            if (callback !== undefined) {
                callback(-1, {"msg" : errMsg});
            }
        };

        xhr.ontimeout = function() {
            var errMsg = cc.formatStr("错误提示：HTTP get Request ontimeout: url(%s)", url);
            cc.error(errMsg);

            if (callback !== undefined) {
                callback(-1, {"msg" : errMsg});
            }
        };

        xhr.send();
        return xhr;
    },

    /**
     * Http post 请求，不支持加密
     *
     * @param {string} url 请求地址
     * @param {object} data 请求发送的数据
     * @param {function} callback 回调函数
     * @param {int} timeout 超时时间(毫秒)
     * @param {object} headers 请求头
     * @param {string} responseType 返回的数据类型（text或arraybuffer）
     * @param {boolean} noFormat 是否添加响应格式（默认为json）
     */
    post : function(url, data, callback, timeout, headers, responseType, noFormat) {
        var xhr = new XMLHttpRequest();
        xhr.timeout = timeout || 5000;

        if(!noFormat)
            url += "?format=json";

        if(responseType === CommHttp.RESP_AB_TYPE)
            xhr.responseType = "arraybuffer";

        cc.log(url);
        xhr.open("POST", url, true);

        if (headers) {
            var isSetContentType = false
            for (var key in headers) {
                if (headers.hasOwnProperty(key)) {
                    xhr.setRequestHeader(key, headers[key]);
                    if (key == "Content-Type") {
                        isSetContentType = true
                    }
                }

            }

            if (!isSetContentType) {
                xhr.setRequestHeader("Content-Type", "application/json")
            }
        } else {
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        }

        xhr.onreadystatechange = function () {
            if(xhr.readyState === 4 && xhr.status >= 200 && xhr.status <= 401) {
                if (callback !== undefined) {

                    if(responseType === CommHttp.RESP_AB_TYPE){
                        callback(xhr.status, xhr.response);
                    }
                    else{
                        callback(xhr.status, xhr.responseText);
                    }
                }
            }
            else
            {
                if (xhr.readyState === 4 && xhr.status !== 200)
                {
                    var errorInfo = cc.formatStr(
                        "错误提示：HTTP post onreadystatechange: url(%s) status(%s) responseText（%s）",
                        url, xhr.status, xhr.responseText);

                    if (callback) {
                        callback(xhr.status, {"msg" : errorInfo});
                    }
                }

            }
        };

        xhr.onerror = function(err) {
            var errMsg = cc.formatStr(
                "错误提示：HTTP post Request onerror: url(%s) errorMsg(%s)",
                url, JSON.stringify(err));

                cc.error(errMsg);

            if (callback) {
                callback(-1, {"msg" : errMsg});
            }
        };

        xhr.ontimeout = function() {
            var errMsg = cc.formatStr("错误提示：HTTP post Request ontimeout: url(%s)", url);
            cc.error(errMsg);

            if (callback) {
                callback(-1, {"msg" : errMsg});
            }
        };

        xhr.send(data);
    },

    uploadFile : function(url, callback, path, params, iscrypt){
        var headers = ""

        // 注意app平台加密数据，小程序平台不加密
        if (params) {
            if (isNative()){
                var joinparams = this.joinParams(params)
                if (iscrypt) {
                    url += "/" + this._encrypt(joinparams) + "?"
                } else {
                    url += "?" + joinparams + "&"
                }
                url += "format=json"
            }
            else if (isWeb())
            {
                //...
            }
            else {
                url += "/" + params.token + "?";
                url += "format=json&mini=1";
            }
        }

        if (isMiniGame()){
            var uploadTask = wx.uploadFile({
                url: url,
                filePath: path,
                name: "file",
                success: function (res) {
                    log("OnHttpComplete res : ", JSON.stringify(res))
                    var result = res.data
                    var obj = JSON.parse(result);
                    log("OnHttpComplete",result);
                    callback(res.statusCode, result);
                },
                fail: function (res) {
                    callback("无法连接到服务器!", res)
                },
            })

            return uploadTask
        } else if (isNative()) {
            var http = new CHttpClient()

            if (callback) {
                http.setCallback(function(http){
                    var result = http.GetData();
                    var obj = JSON.parse(result);
                    log("OnHttpComplete",result);
                    callback(200, result);
                }, function() {
                }, function() {
                }, function() {
                });
            }

            if (http.StartUpload(url, path, "file", headers)) {
                log("上传成功");
                return http
            }
            else
            {
                log("上传失败");
                callback("无法连接到服务器!");
            }
            return http;
        }
    },

    // 下载文件
    downloadFile: function (url, callback) {
        if (url == null || url == "") {
            return;
        }

        var fileName = this.convertPath(url);
        if (fileName == null || fileName == "") {
            callback(null);
            return;
        }
        if(isWeb()) {
            cc.assetManager.loadRemote(url, function (err, dataList) {
                if (err) {
                    callback(null)
                } else {
                    callback(dataList[0])
                }
            })
        }else if(isMiniGame()){
            wx.downloadFile({
                url: url,
                success: function (res) {
                    if (res.statusCode === 200) {
                        Device.saveFile(fileName, "customres/", res, callback);
                    } else {
                        console.warn("文件保存失败code:", res.statusCode);
                        callback(null);
                    }
                },
                fail: function (res) {
                    console.warn("文件保存失败res:", res);
                    callback(null);
                },
            });
        }else if(window.jsb != null) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        Device.saveFile(fileName, "customres/", xhr.response, callback);
                    } else {
                        callback(null);
                    }
                }
            }.bind(this);

            //responseType一定要在外面设置
            xhr.responseType = 'arraybuffer';
            xhr.open("GET", url, true);
            xhr.send();
        }else{
            console.warn("暂不支持下载方式");
            callback(null);
            return;
        }
    },

    // 获取文件名
    convertPath: function (path) {
        if (path == null) {
            return "";
        }
        var pos = path.indexOf("?t=");
        if (pos > 0) {
            path = path.substr(0, pos);
        }

        var len = path.length;
        var index = path.lastIndexOf("/");
        if (index > 0) {
            path = path.substring(index + 1, len);
        }
        return path;
    },

    _encrypt : function(params) {
        var crypt = Helper.JSCryptStr(params, URLKEY);
        return this._cryptencode(crypt);
    },

    _cryptencode : function(crypt) {
        return crypt.replace("/", "-").replace("+", ",");
    },

    setHttpHostCache : function(url){
        var urlReg = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;
        var domainInfo = urlReg.exec(url);
        if(domainInfo.length > 0){
            var domain = domainInfo[0]
            //Device.getIpByHost(domain)
        }
    },

    joinParams : function(params, noUriencode, needsign) {
        var keys = [];
        for (var key in params) {
            if (params[key] == undefined) {
                continue;
            }
            keys.push(key);
        }
        /* 暂时注释
        ArrayEx.sortByCondition(keys, function(a, b) {
            return a < b;
        });
        */
        var dsign = "";
        for (var i = 0; i < keys.length; i++) {
            if (dsign.length > 0) {
                dsign += "&";
            }

            var key = keys[i];
            dsign += key + "=";

            if (noUriencode) {
                dsign += params[key];
            } else {
                dsign += encodeURIComponent(params[key]);
            }
        }

        if (needsign) {
            var token = params.token.toLowerCase();
            dsign += "&sign=" + hex_md5(dsign + "&token=" + token);
        }

        return dsign;
    },

    makeParams : function(params){
        if(params.length > 0){
            var paramStr = "";
            paramStr += "?" + params[0];
            for(var i = 1; i < params.length; ++i){
                paramStr += "&" + params[i];
            }
        }

        return paramStr;
    }
};


/**
 * 请数返回数据的类型
 *
 * @const
 * @type {string}
 */
CommHttp.RESP_AB_TYPE = "arraybuffer";
CommHttp.RESP_TEXT_TYPE = "text";
