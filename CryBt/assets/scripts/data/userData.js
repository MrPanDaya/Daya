(function(){
    window.initLocalData = function () {
        if(window.LocalData) return;

        var defData = {
            mapUnLockId : 0,
            mapStar:{},

            baseExp: 0,
            baseCryCount: 0,
            selCrystalId: 0,
            crystalData: {
                cry0:{lv: 0, curExp: 0, unlock: 1}
            },
        };
        window.LocalData = LocalStorage.getObject("CryBtData", defData);
        saveLocalData();
    };

    window.saveLocalData = function () {
        if(window.LocalData){
            LocalStorage.setObject("CryBtData", window.LocalData);
        }
    };

    window.shareApp = function(params, callBack){
        if(wx && wx.shareAppMessage){
            var args = {};
            if (params.title) {
                args.title = params.title;
            }
            // 携带参数分享，带到 query 中
            if (params.query) {
                args.query = params.query;
            }
            // 如果有指定分享图片，按照 imgpath、imgurl 的顺序显示图片
            // 如果没有指定，使用当前截屏
            if (params.imgpath) {
                args.imageUrl = params.imgpath;
            } else if (params.imgurl) {
                args.imageUrl = params.imgurl;
            }
            wx.shareAppMessage(args);
        }
    };

    window.initWXEvent = function(){
        if(!window.wx) return;
        if(window.initWX) return;
        window.initWX = true;
        wx.onShow(function (opt) {

        });

        wx.onHide(function () {
            if(cc.mainPlayer && cc.mainPlayer.startPlay){
                cc.mainScene.onBtnPause();
            }
        });
    };

    /*
        *描述: 截屏 参数单位为微信的canvas单位
        *参数: x 起点x坐标
        *参数: y 起点y坐标
        *参数: w 宽度
        *参数: h 高度
        *参数: callback 截屏回调
    */
    window.captureScreen = function(x, y, w, h, callback){
        if(!window.wx) return;
        canvas.toTempFilePath({
            x: x,
            y: y,
            width: w,
            height: h,
            destWidth: 500,
            destHeight: 400,
            complete:function(res) {
                callback && callback(res);
            },
            fail:function(res){
                console.log("ShareLogic.captureScreen failed:", res);
                callback && callback(undefined, "截屏失败");
            }
        });
    };

    window.shareByMiniGame = function (params) {
        if(!window.wx) return;
        params.imageUrl = window.LOGIN_SERVER  + "share.jpg";
        wx.shareAppMessage(params);
    };

    //=================================================================
    window.setUnlockMapId = function(mapId){
        var mapList = Object.keys(mapCfg);
        if(LocalData.mapUnLockId >= mapList.length) return;
        if(checkNum(mapId) >= checkNum(getUnlockMapId())){
            LocalData.mapUnLockId += 1;
            var reward = getMapUnlockReward(mapId);
            if(reward){
                setCrystalUnlock(reward.crystalId);
            }
            saveLocalData();
        }
    };
    window.getUnlockMapId = function(){
        var mapList = Object.keys(mapCfg);
        if(LocalData.mapUnLockId >= mapList.length){
            LocalData.mapUnLockId = mapList.length - 1;
        }
        return mapList[LocalData.mapUnLockId];
    };

    window.setMapStarNum = function (mapId, starNum) {
        if(!LocalData.mapStar[mapId] || LocalData.mapStar[mapId] < starNum){
            LocalData.mapStar[mapId] = starNum;
        }
        saveLocalData();
    };
    window.getMapStarNum = function (mapId) {
        if(!LocalData.mapStar[mapId]){
            LocalData.mapStar[mapId] = 0;
            saveLocalData();
        }
        return LocalData.mapStar[mapId];
    };

    window.setCrystalUnlock = function (cryId) {
        if(cryId >= Object.keys(crystalCfg).length) return;
        var cryData = LocalData.crystalData["cry" + cryId];
        if(cryData && cryData.unlock === 1) return;
        LocalData.crystalData["cry" + cryId] = {lv: 0, curExp: 0, unlock: 1};
        saveLocalData();
    };
    window.setCrystalLvUp = function (cryId){
        var cryData = LocalData.crystalData["cry" + cryId];
        if(!cryData || cryData.unlock !== 1) return -1;
        var cryCfg = crystalCfg[cryId + ""];
        if(!cryCfg || cryData.lv >= cryCfg.attList.length) return -2;
        var needBaseCry = cryCfg.attList[cryData.lv].baseCry;
        var needExp = cryCfg.attList[cryData.lv].exp;
        if(needBaseCry > LocalData.baseCryCount) return -3;
        if(needExp > LocalData.baseExp) return -4;
        // 升级
        LocalData.crystalData["cry" + cryId].lv += 1;
        LocalData.baseCryCount -= needBaseCry;
        LocalData.baseExp -= needExp;
        saveLocalData();
        return 0;
    };
    window.addCrystalExp = function (exp){
        LocalData.baseExp += exp;
        saveLocalData();
    };
    window.addBaseCryCout = function (count){
        LocalData.baseCryCount += count;
        saveLocalData();
    };
    window.getCrystalData = function (cryId) {
        if(cryId >= Object.keys(crystalCfg).length) return null;
        if(!LocalData.crystalData["cry" + cryId]){
            LocalData.crystalData["cry" + cryId] = {lv: 0, curExp: 0, unlock: 0};
        }
        return LocalData.crystalData["cry" + cryId];
    };

})();
