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

        this.initCar();
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
        var dltX = dt * this.dir * this.speedX;
        var posX = this.node.x + dltX;
        var endPosX = this.xPosList[this.xPosIndex];
        if ((this.dir < 0 && posX <= endPosX) || (this.dir > 0 && posX >= endPosX)) {
            posX = endPosX;
            this.recover();
        }
        this.node.x = posX;

        // 氮气检测
        this.nitrogentTimer -= dt;
        if (this.nitrogentTimer <= 0) {
            this.nitrogentTimer = 0;
            this.onNitrogenOver();
        }
    },

    onStartPlay(){
        cc.carSpeed = 1000;
        this.moveSound = cc.audioEngine.play(this.audioList[this.soundId.move], true, 0.5);
    },

    initCar() {
        this.xPosList = [-190, -70, 70, 190];
        this.xPosIndex = 1;
        this.achorF = 0.2;
        this.achorB = 0.8;
        this.dir = 0;
        this.speedX = 300;
        this.node.y = 0
        this.node.x = this.xPosList[this.xPosIndex];
        this.node.anchorY = this.achorB;
        this.carPosY = this.node.y;
        this.bRecover = false;
        this.isBroken = false;
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
                // this.node.y += 100;
                // this.carPosY = this.node.y;
                this.onUsedNitrogen();
                break;
            case cc.macro.KEY.down:
                this.onCarBroken();
                // this.node.y -= 100;
                // this.carPosY = this.node.y;
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
        cc.carSpeed = 1200;
        this.achorF = 0.3;
        this.achorB = 0.9;
        this.nitrogentTimer = 5;
    },

    onNitrogenOver() {
        if(this.isBroken){
            return;
        }
        cc.carSpeed = 1000;
        this.achorF = 0.2;
        this.achorB = 0.8;
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
        this.node.anchorY = this.achorF;
        this.node.y = this.carPosY + (this.node.anchorY - lastAnchorY) * this.node.height;
        this.node.runAction(cc.rotateTo(0.15, -20))
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
        this.node.anchorY = this.achorF;
        this.node.y = this.carPosY + (this.node.anchorY - lastAnchorY) * this.node.height;
        this.node.runAction(cc.rotateTo(0.15, 20))
    },

    recover() {
        if (this.bRecover || this.isBroken) {
            return;
        }
        this.bRecover = true;
        var lastAnchorY = this.node.anchorY;
        this.node.anchorY = this.achorB;
        if (this.dir == -1) {
            this.node.x -= this.node.width * 0.5;
        } else if (this.dir == 1) {
            this.node.x += this.node.width * 0.5;
        }
        this.node.y = this.carPosY;
        var rota = cc.rotateTo(0.1, 0);
        var fun = cc.callFunc(function () {
            this.dir = 0;
        }.bind(this))
        this.node.runAction(cc.sequence(rota, fun))
    }

});
