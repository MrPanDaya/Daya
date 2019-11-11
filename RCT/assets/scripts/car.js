cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._achorF = 0.2;
        this._achorB = 0.8;
        this._dir = 0;
        this._speedX = 300;
        this.node.y = 0
        this.node.anchorY = this._achorB;
        this._posY = this.node.y;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onDestroy () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    start () {

    },

    update (dt) {
        var dltX = dt * this._dir * this._speedX;
        this.node.x += dltX;
        cc.log(this.node.x)
    },

    onKeyDown (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.left:
                if(this._dir == 0){
                    this.turnLeft();
                }
                break;
            case cc.macro.KEY.right:
                if(this._dir == 0){
                    this.turnRight();
                }
                break;
            case cc.macro.KEY.up:
                this.node.y += 100;
                this._posY = this.node.y;
                break;
            case cc.macro.KEY.down:
                this.node.y -= 100;
                this._posY = this.node.y;
                break;
            }
    },

    onKeyUp (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.left:
            case cc.macro.KEY.right:
                if(this._dir != 0){
                    this.recover();
                }
                break;
        }
    },

    turnLeft (){
        this._dir = -1;
        var lastAnchorY = this.node.anchorY;
        this.node.anchorY = this._achorF;
        this.node.y = this._posY + (this.node.anchorY - lastAnchorY) * this.node.height;
        this.node.runAction(cc.rotateTo(0.15, -20))
    },

    turnRight (){
        this._dir = 1;
        var lastAnchorY = this.node.anchorY;
        this.node.anchorY = this._achorF;
        this.node.y = this._posY + (this.node.anchorY - lastAnchorY) * this.node.height;
        this.node.runAction(cc.rotateTo(0.15, 20))
    },

    recover (){
        var lastAnchorY = this.node.anchorY;
        this.node.anchorY = this._achorB;
        if(this._dir == -1){
            this.node.x -= this.node.width*0.5;
        }else if(this._dir == 1){
            this.node.x += this.node.width*0.5;
        }
        this.node.y = this._posY;
        this.node.runAction(cc.rotateTo(0.1, 0))
        this._dir = 0;
    }

});
