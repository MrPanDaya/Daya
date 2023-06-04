/*
* 描述：选车场景的类
* */
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

    /*
    * 描述：初始化赛车
    * */
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
        this.scoreNode = cc.find("Canvas/top_node/score").getComponent(cc.Label);
        this.scoreNode.string = cc.LocalData.maxScore || "0";

        this.goldNode = cc.find("Canvas/top_node/gold").getComponent(cc.Label);

        this.uiReward = cc.find("Canvas/reward_node").getComponent("uiReward");

        this.onTotalMoneyChanged();
    },

    /*
    * 描述：开始
    * */
    start () {
        var centerNode = cc.find("Canvas/center_node");
        this.centerPos = centerNode.convertToWorldSpaceAR(cc.v2(0,0));

        // 设置选中
        this.selId = cc.LocalData.selectCar || 0;
        this.carScroll.scrollToOffset(cc.v2(240 * this.selId, 0), 0.3);
    },

    // update (dt) {},

    /*
    * 描述：总金币发生变化的回调
    * */
    onTotalMoneyChanged(){
        // 设置金币
        if(this.goldNode)
            this.goldNode.getComponent(cc.Label).string = cc.LocalData.totalMoney || "0";
    },

    /*
    * 描述：选赛车界面发生滚动的逻辑
    * */
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

    /*
    * 描述：确定按钮的点击回调
    * */
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

    /*
    * 描述：解锁按钮的点击回调
    * */
    onBtnUnlock(){
        window.audioMgr.playSound(cc.soundId.btn);
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

    /*
    * 描述：升级按钮的回调
    * */
    onBtnLvlup(){
        window.audioMgr.playSound(cc.soundId.btn);
        if(this.lvlupNode){
            this.lvlupNode.active = true;
            cc.uiLvlup.setSelId(this.selId);
        }
    },

    /*
    * 描述：菜单按钮的回调
    * */
    onBtnMenu(){
        window.audioMgr.playSound(cc.soundId.btn);
        var set_ui_node = cc.instantiate(this.setMenuPrefab);
        this.node.addChild(set_ui_node);
    },

    /*
    * 描述：分享按钮的回调
    * */
    onBtnShare(){
        var args = {};
        args.title = "这款赛车让我有点小时候的感觉";
        args.desc = "常常想起小时候的黑白掌机里面的赛车，于是决定自己做一个！哈~";
        shareByMiniGame(args);
    },

    /*
    * 描述：礼包按钮的回调
    * */
    onBtnLb(){
        window.audioMgr.playSound(cc.soundId.btn);
        cc.loader.loadRes("prefabs/ui_gift_free", cc.Prefab, function (error, prefab) {
            if (error) {
                cc.error(error);
                return;
            }
            var tipsNode = cc.instantiate(prefab);
            tipsNode.parent = cc.find("Canvas");
        });
    },

    showReward(num){
        var bgNode = cc.find("Canvas/top_node");
        var pos = cc.v2(bgNode.position.x + 250, bgNode.position.y - 120);
        this.uiReward.showReward(num, pos);
    }
});
