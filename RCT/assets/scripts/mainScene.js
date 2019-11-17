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
        roadResList: [cc.Prefab],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.roadNum = 7;
        this.bgHeight = 260 * this.roadNum;
        cc.carSpeed = 0;
        for (var i = 0; i < this.bgArray.length; ++i) {
            for(var j = 0; j < this.roadNum; ++j){
                var road = cc.instantiate(this.roadResList[0]);
                this.bgArray[i].addChild(road);
                road.y = -780 + j*260;
            }
            this.bgArray[i].y = this.bgHeight * (i - 1);
        }
        this.curBgId = 0;
        this.lastBgId = 1;
    },

    start() {

    },

    update(dt) {
        if(!cc.carSpeed){
            return;
        }
        var dtYSpeed = dt * cc.carSpeed * -1;
        for (var i = 0; i < this.bgArray.length; ++i) {
            var posY = this.bgArray[i].y + dtYSpeed;
            this.bgArray[i].y += dtYSpeed;
            if (posY <= -this.bgHeight) {
                var dltY = posY + this.bgHeight;
                this.bgArray[i].y = this.bgHeight + dltY;
            } else {
                this.bgArray[i].y = posY;
            }
        }
    },

    onDestroy(){
        if(cc.mainMenu){
            cc.mainMenu.stop();
        }
    },

    onBtnStartGame(){
        cc.mainMenu = this.getComponent("cc.AudioSource");
        if(cc.mainMenu){
            cc.mainMenu.play();
        }
        this.btnStart = cc.find('Canvas/btnStart');
        if(this.btnStart){
            this.btnStart.active = false;
        }
        
        if(cc.mainPlayer){
            cc.mainPlayer.onStartPlay();
        }
        
    },

    onBtnPause(){
        if(cc.mainPlayer){
            cc.mainPlayer.onCarBroken();
        }
        if(this.btnStart){
            this.btnStart.active = true;
        }
    },

});
