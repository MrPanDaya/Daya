cc.Class({
    extends: cc.Component,

    properties: {
        gasAniPrefab: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.mainPlayer = this;
        this.startPlay = false;
        this.node.active = false;
        this.grassNode = cc.instantiate(this.gasAniPrefab);
        this.node.addChild(this.grassNode);
        this.grassNode.active = false;
        this.boxCollider = this.getComponent(cc.PhysicsPolygonCollider);

        this.initKeyEvent();
    },

    onDestroy() {
        if(cc.sys.os === 'Windows'){
            cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        }
    },

    // start() {
    // },

    update(dt) {
        if(this.isBroken || !this.startPlay || cc.mainScene.pause){
            return;
        }
        var dltX = dt * this.dir * this.carCfg.maxSpeedX;
        var posX = this.node.x + dltX;
        var endPosX = this.xPosList[this.xPosIndex];
        if ((this.dir < 0 && posX <= endPosX) || (this.dir > 0 && posX >= endPosX)) {
            posX = endPosX;
            this.xPosIndex += this.dir;
            if(this.xPosIndex < 0){
                this.xPosIndex = 0;
            }else if(this.xPosIndex > 3){
                this.xPosIndex = 3;
            }
        }
        this.node.x = posX;

        this.onUpdateNitrogen(dt);
    },

    onUpdateNitrogen(dt){
        if(this.ngTimer > 0){
            this.addSpeedByNitrogen(dt);
        }else{
            this.decSpeedByNoNitrogen(dt);
        }

        // 氮气检测
        this.ngTimer -= dt;
        if (this.ngTimer <= 0) {
            this.ngTimer = 0;
            this.onNitrogenOver();
        }
    },

    // 氮气加速
    addSpeedByNitrogen(dt){
        // 加速到最大速度
        var dlSpeed = this.carCfg.addSpeedN*dt;
        if(cc.carSpeed + dlSpeed >= this.carCfg.maxSpeedN){
            cc.carSpeed = this.carCfg.maxSpeedN;
        }else{
            cc.carSpeed += dlSpeed;
        }
    },

    // 氮气结束
    decSpeedByNoNitrogen(dt){
        if(cc.carSpeed < this.carCfg.maxSpeed){
            var dlSpeed = this.carCfg.addSpeed*dt;
            if(cc.carSpeed + dlSpeed >= this.carCfg.maxSpeed){
                cc.carSpeed = this.carCfg.maxSpeed;
            }else{
                cc.carSpeed += dlSpeed;
            }
        }else{
            // 速度减到正常速度
            var dlSpeed = 100*dt;
            if(cc.carSpeed - dlSpeed <= this.carCfg.maxSpeed){
                cc.carSpeed = this.carCfg.maxSpeed;
            }else{
                cc.carSpeed -= dlSpeed;
            }
        }
    },

    onStartPlay(){
        this.startPlay = true;
        this.isBroken = false;
        this.dir = 0;
        this.xPosIndex = 1;
        this.node.angle = 0;
        this.setAnchorY(this.carCfg.achorB);
        this.node.x = this.startPos.x;
        this.node.y = this.startPos.y;
        this.carPosY = this.node.y;
        this.setAnchorY(this.carCfg.achorB);
        this.ngTimer = 0;
        
        cc.carSpeed = 0;
        cc.audioMgr.playSound(cc.soundId.move, true);
    },

    initCar(id) {
        this.xPosList = [-260, -85, 85, 260];
        this.xPosIndex = 2;
        this.startPlay = false;
        this.bRecover = false;
        this.isBroken = false;
        this.dir = 0;
        this.startPos = cc.v2(this.xPosList[this.xPosIndex], -250);
        this.node.x = this.startPos.x;
        this.node.y = this.startPos.y;
        this.carPosY = this.node.y;

        // 获取配置
        this.carCfg = mainCarCfg['car'+id];
        this.node.anchorY = this.carCfg.achorB;
        var self = this;
        cc.loader.loadRes(this.carCfg.img, cc.SpriteFrame, function (err, spriteFrame) {
            self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            self.node.active = true;
        });
    },

    initKeyEvent(){
        if (window.wx && wx.onAccelerometerChange) {
            wx.onAccelerometerChange(function (res) {
                if (this.dir == 0) {
                    if (res.x > 0.3) {
                        this.turnRight();
                    } else if (res.x < -0.3) {
                        this.turnLeft();
                    }
                }
            }.bind(this))
        }
        if(cc.sys.os === 'Windows'){
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        }
    },

    onKeyDown(event) {
        if(cc.mainScene.pause){
            return;
        }
        switch (event.keyCode) {
            case cc.macro.KEY.left:
                if (this.dir == 0) {
                    this.turnLeft();
                }
                break;
            case cc.macro.KEY.right:
                if (this.dir == 0) {
                    this.turnRight();
                }
                break;
            case cc.macro.KEY.up:
                this.onUsedNitrogen();
                break;
            case cc.macro.KEY.down:
                if(cc.mainScene){
                    cc.mainScene.onBtnPause();
                }
                break;
        }
    },

    onKeyUp(event){
        if(cc.mainScene.pause){
            return;
        }
        switch (event.keyCode) {
            case cc.macro.KEY.left:
                this.recover();
                break;
            case cc.macro.KEY.right:
                this.recover();
                break;
        }
    },

    onCarBroken() {
        if(this.isBroken){
            return;
        }
        this.isBroken = true;
        cc.carSpeed = 0;
        cc.audioMgr.stopSound(cc.soundId.move);
    },

    onCarPause(bPause){
        if(cc.mainScene.pause){
            cc.audioMgr.stopSound(cc.soundId.move);
        }else{
            cc.audioMgr.playSound(cc.soundId.move, true);
        }
    },

    // 氮气加速
    onUsedNitrogen() {
        if(this.isBroken){
            return;
        }
        this.grassNode.active = true;
        //cc.carSpeed = this.carCfg.maxSpeedN;
        this.ngTimer = this.carCfg.ngTimer;
    },

    onNitrogenOver() {
        this.grassNode.active = false;
        if(this.isBroken){
            return;
        }
        // cc.carSpeed = this.carCfg.maxSpeed;
    },

    setAnchorY(anchorY){
        var lastAnchorY = this.node.anchorY;
        this.node.anchorY = anchorY;
        var dltY = (this.node.anchorY - lastAnchorY) * this.node.height;
        this.node.y = this.carPosY + dltY;
        this.grassNode.y -= dltY;
        this.boxCollider.offset.y -= dltY;
        this.boxCollider.apply();
    },

    turnLeft() {
        if (this.xPosIndex <= 0 || this.isBroken) {
            return;
        }
        cc.audioMgr.playSound(cc.soundId.brake);
        this.node.stopAllActions();
        this.dir = -1;
        this.xPosIndex -= 1;
        this.bRecover = false;
        this.setAnchorY(this.carCfg.achorF);
        this.node.runAction(cc.rotateTo(this.carCfg.turnTime, -this.carCfg.carAng))
    },

    turnRight() {
        if (this.xPosIndex >= 3 || this.isBroken) {
            return;
        }
        cc.audioMgr.playSound(cc.soundId.brake);
        this.node.stopAllActions();
        this.dir = 1;
        this.xPosIndex += 1;
        this.bRecover = false;
        this.setAnchorY(this.carCfg.achorF);
        this.node.runAction(cc.rotateTo(this.carCfg.turnTime, this.carCfg.carAng))
    },

    recover() {
        if (this.bRecover || this.isBroken) {
            return;
        }
        this.bRecover = true;
        this.setAnchorY(this.carCfg.achorB);
        if (this.dir == -1) {
            this.node.x -= this.node.width * 0.5;
        } else if (this.dir == 1) {
            this.node.x += this.node.width * 0.5;
        }
        this.node.y = this.carPosY;
        var rota = cc.rotateTo(this.carCfg.recoverTime, 0);
        var fun = cc.callFunc(function () {
            this.dir = 0;
        }.bind(this))
        this.node.runAction(cc.sequence(rota, fun))
    },

    onBeginContact(contact, sefCollider, otherCollider){
        if(this.ngTimer > 0){
            return;
        }
        cc.audioMgr.playSound(cc.soundId.broken);
        if(cc.mainScene && !this.isBroken){
            cc.mainScene.onGameStop();
        }
    },

});
