// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        backNode: cc.Node,
        roadPrefab: cc.Prefab,
        carPrefab: cc.Prefab,
        carScroll: cc.ScrollView
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.roadNum = 7;
        this.bgHeight = 260 * this.roadNum;
        for (var j = 0; j < this.roadNum; ++j) {
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
            car.carId = 0;
            var carCfg = mainCarCfg['car'+i];
            cc.loader.loadRes(carCfg.img, cc.SpriteFrame, function (err, spriteFrame) {
                var picNode = this.getChildByName("car_node");
                picNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            }.bind(car));
            this.showList.push(car);
        }
        this.selId = 0;
        this.showList[this.selId].setScale(1.5, 1.5);
    },

    start () {
        var centerNode = cc.find("Canvas/center_node");
        this.centerPos = centerNode.convertToWorldSpaceAR(cc.v2(0,0));
    },

    // update (dt) {},

    carScoll() {
        for (var key in this.showList) {
            var node = this.showList[key];
            if (node && node.active) {
                var pos = this.carScroll.content.convertToWorldSpaceAR(cc.v2(node.x, node.y));
                var dis = Math.abs(pos.x - this.centerPos.x)
                if (dis >= 100) {
                    node.setScale(1, 1);
                } else {
                    var scale = Math.min(1 + 0.5 * (120 - dis) / 100, 1.5);
                    node.setScale(scale, scale);
                    if (scale == 1.5) {
                        this.selId = node.carId;
                        var unLock = LocalStorage.getNumber("unLockCar" + this.selId);
                        if(unLock > 0){

                        }
                    }
                }
            }
        }
    },

    btnOK() {

    },

});
