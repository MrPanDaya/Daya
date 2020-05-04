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

    // LIFE-CYCLE CALLBACKS:
    // onLoad () {},
    // start () {},
    // update (dt) {},

    setVisible(bVisible){
        if(!this.startImg || !this.restartImg){
            var btnRestart = this.node.getChildByName("btn_restart");
            this.startImg = btnRestart.getChildByName("start_img");
            this.restartImg = btnRestart.getChildByName("restart_img");
        }
        if(bVisible){
            this.startImg.active = !cc.mainPlayer.startPlay;
            this.restartImg.active = cc.mainPlayer.startPlay;
        }
        this.node.active = bVisible;
    },
    
    onBtnContinue() {
        cc.audioMgr.playSound(cc.soundId.btn);
        this.node.active = false;

        if(!cc.mainScene.pause || !cc.mainPlayer || !cc.mainPlayer.startPlay){
            return;
        }
        cc.audioMgr.playMainMenu();

        // 开启物理系统
        cc.director.getPhysicsManager().enabled = true;

        if(cc.mainScene.pause){
            cc.mainScene.pause = false;
            if (cc.mainPlayer) cc.mainPlayer.onCarPause(false);
        }
    },

    onBtnStartGame() {
        if(cc.mainScene) cc.mainScene.onBtnStartGame();
    },

    onBtnExit(){
        var self = this
        cc.director.preloadScene("selRoleScene", function () {
            cc.audioMgr.playSound(cc.soundId.btn);
            if (self.node)  self.node.active = false;
            cc.director.loadScene("selRoleScene");
        });
    },
});
