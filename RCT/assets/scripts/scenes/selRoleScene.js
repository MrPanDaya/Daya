cc.Class({
    extends: cc.Component,

    properties: {
        backNode: cc.Node,
        roadPrefab: cc.Prefab,
        carPrefab: cc.Prefab,
        setMenuPrefab: cc.Prefab,
        carScroll: cc.ScrollView,
        lvlupNode: cc.Node,
        btnOkNode: cc.Node,
        btnLvlupNode: cc.Node,
        btnUnlockNode: cc.Node,
        labCarName: cc.Label,
    },

    onLoad () {
        initLocalData();
        cc.selRoleScene = this;

        for (var j = 0; j < 7; ++j) {
            var road = cc.instantiate(this.roadPrefab);
            this.backNode.addChild(road);
            road.y = -780 + j * 260;
        }
        this.showList = [];
        this.carScroll.content.width = 240 * 8;
        for(var i = 0; i < 6; ++i){
            var car = cc.instantiate(this.carPrefab);
            this.carScroll.content.addChild(car);
            car.x = (i + 1) * 240 + 100;
            car.carId = i;
            var carCfg = mainCarCfg['car'+i];
            cc.loader.loadRes(carCfg.img, cc.SpriteFrame, function (err, spriteFrame) {
                var picNode = this.getChildByName("car_node");
                picNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                var carSelNode = this.getChildByName('car_sel');
                carSelNode.active = false;
            }.bind(car));
            this.showList.push(car);
        }
        // cc.LocalData.totalMoney = 1000000;
        this.selId = cc.LocalData.selectCar || 0;
        this.showList[this.selId].setScale(1.5, 1.5);
        var unLock = cc.LocalData.unLockInfo["car" + this.selId] || 0;
        this.btnOkNode.active = unLock > 0;
        this.btnLvlupNode.active = unLock > 0;
        this.btnUnlockNode.active = unLock <= 0;
        var cfg = mainCarCfg['car' + this.selId];
        this.labCarName.string = cfg.name || '';

        // 设置分数
        var scoreNode = cc.find("Canvas/top_node/score");
        scoreNode.getComponent(cc.Label).string = cc.LocalData.maxScore || "0";

        this.onTotalMoneyChanged();
    },

    start () {
        var centerNode = cc.find("Canvas/center_node");
        this.centerPos = centerNode.convertToWorldSpaceAR(cc.v2(0,0));

        // 设置选中
        this.selId = cc.LocalData.selectCar || 0;
        this.carScroll.scrollToOffset(cc.v2(240 * this.selId, 0), 0.3);
    },

    // update (dt) {},

    onTotalMoneyChanged(){
        // 设置金币
        var goldNode = cc.find("Canvas/top_node/gold");
        goldNode.getComponent(cc.Label).string = cc.LocalData.totalMoney || "0";
    },

    carScoll() {
        for (var key in this.showList) {
            var node = this.showList[key];
            if (node && node.active) {
                var pos = this.carScroll.content.convertToWorldSpaceAR(cc.v2(node.x, node.y));
                var dis = Math.abs(pos.x - this.centerPos.x);
                var carSelNode = node.getChildByName('car_sel');
                if (dis >= 100) {
                    node.setScale(1, 1);
                } else {
                    var scale = Math.min(1 + 0.5 * (120 - dis) / 100, 1.5);
                    node.setScale(scale, scale);
                    if(this.selId !== node.carId){
                        this.selId = node.carId;
                        var carCfg = mainCarCfg['car' + this.selId];
                        this.labCarName.string = carCfg.name || '';
                        var unLock = cc.LocalData.unLockInfo["car" + this.selId] || 0;
                        this.btnOkNode.active = unLock > 0;
                        this.btnLvlupNode.active = unLock > 0;
                        this.btnUnlockNode.active = unLock <= 0;
                        if(unLock <= 0){
                            var labUnlockNode = this.btnUnlockNode.getChildByName("lab_unlock");
                            labUnlockNode.getComponent(cc.Label).string = carCfg.unLockMoney;
                            labUnlockNode.color = cc.LocalData.totalMoney < carCfg.unLockMoney ? cc.color(255, 0, 0, 255) : cc.color(225, 170, 0, 255);
                        }
                    }
                }
                // 选中框
                carSelNode.active = (node.carId === this.selId);
            }
        }
    },

    onBtnOK() {
        var unLock = cc.LocalData.unLockInfo["car" + this.selId] || 0;
        if(unLock > 0) {
            cc.LocalData.selectCar = this.selId;
            saveLocalData();
            cc.director.preloadScene("mainScene", function () {
                window.audioMgr.playSound(cc.soundId.btn);
                cc.director.loadScene("mainScene");
            });
        }
    },

    onBtnUnlock(){
        var unLock = cc.LocalData.unLockInfo["car" + this.selId] || 0;
        if(unLock <= 0) {
            var carCfg = mainCarCfg['car' + this.selId];
            if(cc.LocalData.totalMoney >= carCfg.unLockMoney){
                cc.LocalData.totalMoney -= carCfg.unLockMoney;
                cc.LocalData.unLockInfo["car" + this.selId] = 1;
                saveLocalData();
                this.btnOkNode.active = true;
                this.btnLvlupNode.active = true;
                this.btnUnlockNode.active = false;
                // 更新金币
                this.onTotalMoneyChanged();
            }else{
                console.log("money not enough")
            }
        }
    },

    onBtnLvlup(){
        if(this.lvlupNode){
            this.lvlupNode.active = true;
            cc.uiLvlup.setSelId(this.selId);
        }
    },

    onBtnMenu(){
        window.audioMgr.playSound(cc.soundId.btn);
        var set_ui_node = cc.instantiate(this.setMenuPrefab);
        this.node.addChild(set_ui_node);
    },
});
