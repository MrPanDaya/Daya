cc.Class({
    extends: cc.Component,

    properties: {
        backNode: cc.Node,
        roadPrefab: cc.Prefab,
        carPrefab: cc.Prefab,
        carScroll: cc.ScrollView,
        labSel: cc.Label,
        labUnlock: cc.Label,
        labCarName: cc.Label,
    },

    onLoad () {
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
        // LocalStorage.setNumber("totalMoney", 100000000);
        LocalStorage.setNumber("unLockCar0", 1);
        this.selId = LocalStorage.getNumber("selectCar") || 0;
        this.showList[this.selId].setScale(1.5, 1.5);
        var unLock = LocalStorage.getNumber("unLockCar" + this.selId);
        this.labUnlock.node.active = unLock <= 0;
        this.labSel.node.active = unLock > 0;
        var cfg = mainCarCfg['car' + this.selId];
        this.labCarName.string = cfg.name || '';

        // 设置分数
        var scoreNode = cc.find("Canvas/top_node/score");
        scoreNode.getComponent(cc.Label).string = LocalStorage.getString("maxScore") || "0";
        // 设置金币
        var goldNode = cc.find("Canvas/top_node/gold");
        goldNode.getComponent(cc.Label).string = LocalStorage.getString("totalMoney") || "0";
    },

    start () {
        var centerNode = cc.find("Canvas/center_node");
        this.centerPos = centerNode.convertToWorldSpaceAR(cc.v2(0,0));

        // 适配文字背景
        // var scoreNode = cc.find("Canvas/top_node/score_bg/score");
        // if(scoreNode.width >= 170){
        //     var scoreBgNode = cc.find("Canvas/top_node/score_bg");
        //     scoreBgNode.width = scoreNode.width + 30;
        // }
        // var goldNode = cc.find("Canvas/top_node/gold_bg/gold");
        // if(goldNode.width >= 170){
        //     var goldBgNode = cc.find("Canvas/top_node/gold_bg");
        //     goldBgNode.width = goldNode.width + 30;
        // }
        // 设置选中
        this.selId = LocalStorage.getNumber("selectCar") || 0;
        this.carScroll.scrollToOffset(cc.v2(240 * this.selId, 0), 0.3);
    },

    // update (dt) {},

    carScoll() {
        for (var key in this.showList) {
            var node = this.showList[key];
            if (node && node.active) {
                var pos = this.carScroll.content.convertToWorldSpaceAR(cc.v2(node.x, node.y));
                var dis = Math.abs(pos.x - this.centerPos.x);
                var carSelNode = node.getChildByName('car_sel');
                if (dis >= 100) {
                    node.setScale(1, 1);
                    carSelNode.active = false;
                } else {
                    var scale = Math.min(1 + 0.5 * (120 - dis) / 100, 1.5);
                    node.setScale(scale, scale);
                    if (scale == 1.5) {
                        this.selId = node.carId;
                        var unLock = LocalStorage.getNumber("unLockCar" + this.selId);
                        this.labUnlock.node.active = unLock <= 0;
                        this.labSel.node.active = unLock > 0;
                        var carCfg = mainCarCfg['car' + this.selId];
                        this.labCarName.string = carCfg.name || '';
                        if(unLock <= 0) {
                            this.labUnlock.string = carCfg.unLockMoney + "";
                        }
                    }
                    // 选中框
                    carSelNode.active = (node.carId === this.selId);
                }
            }
        }
    },

    btnOK() {
        var unLock = LocalStorage.getNumber("unLockCar" + this.selId);
        if(unLock <= 0) {
            var carCfg = mainCarCfg['car' + this.selId];
            var totalMoney = LocalStorage.getNumber("totalMoney");
            if(totalMoney >= carCfg.unLockMoney){
                totalMoney -= carCfg.unLockMoney;
                LocalStorage.setNumber("totalMoney", totalMoney);
                LocalStorage.setNumber("unLockCar" + this.selId, 1);
                this.labUnlock.node.active = false;
                this.labSel.node.active = true;
            }else{
                console.log("money not enough")
            }
        }else{
            LocalStorage.setNumber("selectCar", this.selId);
            cc.director.preloadScene("mainScene", function () {
                cc.audioMgr.playSound(cc.soundId.btn);
                cc.director.loadScene("mainScene");
            });
        }
    },

});
