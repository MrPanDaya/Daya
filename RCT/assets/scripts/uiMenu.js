/*
* 描述：游戏主界面类
* */
cc.Class({
    extends: cc.Component,

    /*
    * 描述：设置主界面的显示或隐藏
    * */
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

    /*
    * 描述：继续按钮的回调
    * */
    onBtnContinue() {
        window.audioMgr.playSound(cc.soundId.btn);
        this.node.active = false;

        if(!cc.mainScene.pause || !cc.mainPlayer || !cc.mainPlayer.startPlay){
            return;
        }
        window.audioMgr.playMainMenu();

        // 开启物理系统
        cc.director.getPhysicsManager().enabled = true;

        if(cc.mainScene.pause){
            cc.mainScene.pause = false;
            if (cc.mainPlayer) cc.mainPlayer.onCarPause(false);
        }
    },

    /*
    * 描述：开始游戏按钮的回调
    * */
    onBtnStartGame() {
        if(cc.mainScene) cc.mainScene.onBtnStartGame();
    },

    /*
    * 描述：推出游戏按钮的回调
    * */
    onBtnExit(){
        var self = this
        cc.director.preloadScene("selRoleScene", function () {
            window.audioMgr.playSound(cc.soundId.btn);
            if (self.node)  self.node.active = false;
            if(cc.mainPlayer) cc.mainPlayer.startPlay = false;
            cc.director.loadScene("selRoleScene");
        });
    },
});
