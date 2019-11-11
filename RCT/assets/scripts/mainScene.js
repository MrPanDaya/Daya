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
        bgArray: [cc.Node],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._curBgId = 0;
        this._lastBgId = 2;
        this._bgSpeed = -1000;
        this._bgHeight = this.bgArray[0].height;

        for(var i = 0; i < this.bgArray.length; ++i){
            this.bgArray[i].y = this._bgHeight*(i-1);
        }
    },

    start () {

    },

    update (dt) {
        var dtYSpeed = dt*this._bgSpeed;
        for(var i = 0; i < this.bgArray.length; ++i){
            var posY = this.bgArray[i].y + dtYSpeed;
            this.bgArray[i].y += dtYSpeed;
            if(posY <= -this._bgHeight){
                var dltY = posY + this._bgHeight;
                this.bgArray[i].y = this._bgHeight + dltY;
            }else{
                this.bgArray[i].y = posY;
            }
        }
    },
});
