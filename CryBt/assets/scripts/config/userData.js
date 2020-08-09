(function(){
    window.initLocalData = function () {
        if(window.LocalData) return;

        var defData = {
            mapUnLockId : 0,
            mapStar:{},
        }
        window.LocalData = LocalStorage.getObject("CryBtData", defData);
        saveLocalData();
    };

    window.saveLocalData = function () {
        if(window.LocalData){
            LocalStorage.setObject("CryBtData", window.LocalData);
        }
    };

    window.setUnlockMapId = function(mapId){
        var mapList = Object.keys(mapCfg);
        if(LocalData.mapUnLockId >= mapList.length) return;
        if(checkNum(mapId) >= checkNum(getUnlockMapId())){
            LocalData.mapUnLockId += 1;
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

})();
