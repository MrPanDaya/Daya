cc.Class({
    extends: cc.Component,

    properties: {
        musicSelNode: cc.Node,
        musicUnSelNode: cc.Node,

        soundSelNode: cc.Node,
        soundUnSelNode: cc.Node,
    },
    onLoad () {
        this.isMusicMute = true;
        this.isPlaySound = true;
        this.onBtnMusic();
        this.onBtnSound();
    },
    // start () {},
    // update (dt) {},
    onBtnMusic(){
        window.audioMgr.playSound(cc.soundId.btn2);
        this.isMusicMute = !this.isMusicMute;
        this.musicSelNode.active = !this.isMusicMute;
        this.musicUnSelNode.active = this.isMusicMute;

        // setUnlockMapId(getUnlockMapId());
        // setCrystalUnlock(4);
    },

    onBtnSound(){
        window.audioMgr.playSound(cc.soundId.btn2);
        this.isPlaySound = !this.isPlaySound;
        this.soundSelNode.active = this.isPlaySound;
        this.soundUnSelNode.active = !this.isPlaySound;

        //todo test
        addCrystalExp(3400);
        addBaseCryCout(500);
    },

    onBtnClose(){
        window.audioMgr.playSound(cc.soundId.btn2);
        this.node.active = false;
    },

    onBtnExitGame(){
        window.audioMgr.playSound(cc.soundId.btn);
        cc.director.preloadScene("LoginScene", function () {
            cc.director.loadScene("LoginScene");
        });
    },
});
