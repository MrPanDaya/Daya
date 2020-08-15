(function(){
    window.initLocalData = function () {
        if(window.LocalData) return;

        var defData = {
            mapUnLockId : 0,
            mapStar:{},

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

    //=================================================================
    window.setUnlockMapId = function(mapId){
        var mapList = Object.keys(mapCfg);
        if(LocalData.mapUnLockId >= mapList.length) return;
        if(checkNum(mapId) >= checkNum(getUnlockMapId())){
            LocalData.mapUnLockId += 1;
            var reward = getMapUnlockReward(getUnlockMapId());
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
        if(needExp > cryData.curExp) return -4;
        // 升级
        LocalData.crystalData["cry" + cryId].lv += 1;
        LocalData.crystalData["cry" + cryId].curExp -= needExp;
        LocalData.baseCryCount -= needBaseCry;
        saveLocalData();
        return 0;
    };
    window.addCrystalExp = function (cryId, exp){
        var cryData = LocalData.crystalData["cry" + cryId];
        if(!cryData || cryData.unlock !== 1) return;
        LocalData.crystalData["cry" + cryId].curExp += exp;
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
