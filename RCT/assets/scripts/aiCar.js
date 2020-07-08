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
        boomAniPrefab: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.y = 2000;
        this.offsetPosY = [-10,5,-5,10,-5,5];
        this.isBroken = false;
        this.boomNode = cc.instantiate(this.boomAniPrefab);
        this.node.addChild(this.boomNode);
        this.boomNode.active = false;
    },

    initAiCar(target, roadIndex){
        if(!target){
            return;
        }
        this.mainScene = target;
        this.isBroken = false;
        this.boomNode.active = false;
        // 随机车
        var carCount = Object.keys(aiCarCfg).length;
        if(carCount <= 0){
            return;
        }
        this.nIndex = Math.round(Math.random()*(carCount-1));
        this.aiCarCfg = aiCarCfg["car"+this.nIndex];
        if(!this.aiCarCfg){
            cc.error("get ai car config error " + this.nIndex);
            return;
        }
        var self = this;
        cc.loader.loadRes(this.aiCarCfg.img, cc.SpriteFrame, function (err, spriteFrame) {
            self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            self.node.active = true;
        });
        // 随机车道
        this.speed = this.aiCarCfg.speed;
        var xPosList = [-260, -85, 85, 260];
        this.nRoadId = roadIndex;
        this.node.x = xPosList[this.nRoadId];
        this.node.y = 2000;
        this.node.angle = 0;
        this.nDir = 1;
        if(this.nRoadId === 0 || this.nRoadId === 3){
            this.nDir = -1;
            this.node.angle += 180;
            this.speed *= 0.08;
        }
        this.clearTimer = 0;
        // 设置碰撞区域大小
        var boxCllider = this.node.getComponent(cc.PhysicsPolygonCollider);
        if(this.nRoadId === 0 || this.nRoadId === 3){
            boxCllider.restitution = 0.1;
        }else{
            boxCllider.restitution = 0.9;
        }
        var he = this.aiCarCfg.height / 2;
        var offY = [-he, -he, he, he, he, -he];
        for(var i = 0; i < offY.length; ++i){
            boxCllider.points[i].y = offY[i] + this.offsetPosY[i];
        }
        boxCllider.apply();
        // console.log("heigth :" + this.aiCarCfg.height + " " + boxCllider.size.height);
        // console.log("carId,roadId,speed : " + this.nIndex + " " + this.nRoadId + " " + this.speed);
    },


    update (dt) {
        if(cc.mainPlayer && cc.mainPlayer.isBroken || this.isBroken === true){
            this.clearTimer += dt;
            if(this.clearTimer >= 0.6 && this.boomNode.active === false){
                window.audioMgr.playSound("boom");
                this.boomNode.active = true;
                this.boomNode.getComponent(cc.Animation).play("boomAni", 0);
            }
            if(this.clearTimer >= 0.8){
                this.mainScene.removeAiCar(this.node);
            }
            return;
        }
        if(!cc.carSpeed || cc.mainScene.pause){
            return;
        }
        var speed = this.aiCarCfg.speed*this.nDir - cc.carSpeed;
        var carRigidbody = this.node.getComponent(cc.RigidBody);
        carRigidbody.linearVelocity = cc.v2(0, speed);

        if(this.node.y < -2000 || this.node.y > 2000){
            this.mainScene.removeAiCar(this.node);
        }
    },

    onBeginContact(contact, sefCollider, otherCollider){
        this.isBroken = true;
    },
});
