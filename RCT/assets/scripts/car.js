cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.xPosList = [-190, -70, 70, 190];
        this.xPosIndex = 1;
        this.achorF = 0.2;
        this.achorB = 0.8;
        this.dir = 0;
        this.speedX = 300;
        cc.carSpeed = 1000;
        this.node.y = 0
        this.node.x = this.xPosList[this.xPosIndex];
        this.node.anchorY = this.achorB;
        this.carPosY = this.node.y;
        this.bRecover = false;

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },

    start() {
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
        if(this.nitrogentTimer <= 0){
            this.nitrogentTimer = 0;
            this.onNitrogenOver();
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
                this.node.y -= 100;
                this.carPosY = this.node.y;
                break;
        }
    },

    // 氮气加速
    onUsedNitrogen(){
        cc.carSpeed *= 1.2;
        this.achorF = 0.3;
        this.achorB = 0.9;
        this.nitrogentTimer = 5;
    },

    onNitrogenOver(){
        cc.carSpeed = 1000;
        this.achorF = 0.2;
        this.achorB = 0.8;
    },

    turnLeft() {
        if (this.xPosIndex <= 0) {
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
        if (this.xPosIndex >= 3) {
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
        if (this.bRecover) {
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
