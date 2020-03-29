cc.Class({
    extends: cc.Component,

    properties: {
        audioList: {
            type: cc.AudioClip,
            default: []
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.soundId = {
            move: 0,
            broken: 1,
            brake: 2,
            nitrogn: 3,
            pass: 4,
        }
        cc.mainPlayer = this;
        this.startPlay = false;
        this.node.active = false;
        this.initKeyEvent();
    },

    onDestroy() {
        if(cc.sys.os === 'Windows'){
            cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        }
    },

    start() {
        
    },

    update(dt) {
        if(this.isBroken || !this.startPlay){
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
        if(this.nitrogentTimer > 0){
            this.addSpeedByNitrogen(dt);
        }else{
            this.decSpeedByNoNitrogen(dt);
        }

        // 氮气检测
        this.nitrogentTimer -= dt;
        if (this.nitrogentTimer <= 0) {
            this.nitrogentTimer = 0;
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
        cc.carSpeed = 0;
        if(bPlaySound){
            this.moveSound = cc.audioEngine.play(this.audioList[this.soundId.move], true, 0.5);
        }
    },

    initCar(id) {
        this.xPosList = [-260, -85, 85, 260];
        this.xPosIndex = 1;
        this.bRecover = false;
        this.isBroken = false;
        this.dir = 0;
        this.node.y = 0
        this.node.x = this.xPosList[this.xPosIndex];
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
                this.onCarBroken();
                break;
        }
    },

    onKeyUp(event){
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
        this.isBroken = true;
        cc.carSpeed = 0;
        if(this.moveSound != null){
            cc.audioEngine.stop(this.moveSound);
            this.moveSound = null;
        }
        if(cc.mainMenu){
            cc.mainMenu.stop();
        }
    },

    // 氮气加速
    onUsedNitrogen() {
        if(this.isBroken){
            return;
        }
        //cc.carSpeed = this.carCfg.maxSpeedN;
        this.nitrogentTimer = this.carCfg.nitrogentTimer;
    },

    onNitrogenOver() {
        if(this.isBroken){
            return;
        }
        // cc.carSpeed = this.carCfg.maxSpeed;
    },

    turnLeft() {
        if (this.xPosIndex <= 0 || this.isBroken) {
            return;
        }
        this.node.stopAllActions();
        this.dir = -1;
        this.xPosIndex -= 1;
        this.bRecover = false;
        var lastAnchorY = this.node.anchorY;
        this.node.anchorY = this.carCfg.achorF;
        this.node.y = this.carPosY + (this.node.anchorY - lastAnchorY) * this.node.height;
        this.node.runAction(cc.rotateTo(this.carCfg.turnTime, -this.carCfg.carAng))
    },

    turnRight() {
        if (this.xPosIndex >= 3 || this.isBroken) {
            return;
        }
        this.node.stopAllActions();
        this.dir = 1;
        this.xPosIndex += 1;
        this.bRecover = false;
        var lastAnchorY = this.node.anchorY;
        this.node.anchorY = this.carCfg.achorF;
        this.node.y = this.carPosY + (this.node.anchorY - lastAnchorY) * this.node.height;
        this.node.runAction(cc.rotateTo(this.carCfg.turnTime, this.carCfg.carAng))
    },

    recover() {
        if (this.bRecover || this.isBroken) {
            return;
        }
        this.bRecover = true;
        var lastAnchorY = this.node.anchorY;
        this.node.anchorY = this.carCfg.achorB;
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
        this.onCarBroken();
        console.log("onBeginContact");
    },

});
