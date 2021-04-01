cc.Class({
    extends: cc.Component,

    properties: {
        musicSelNode: cc.Node,
        musicUnSelNode: cc.Node,

        soundSelNode: cc.Node,
        soundUnSelNode: cc.Node,
    },
    onLoad () {
        this.setMusicBtnSelect(!cc.audioEngine.getMusicMuted())
        this.setSoundBtnSelect(!cc.audioEngine.getEffectMuted())
    },
    // start () {},
    // update (dt) {},
    setMusicBtnSelect(bSelect){
        this.musicSelNode.active = bSelect;
        this.musicUnSelNode.active = !bSelect;
    },
    setSoundBtnSelect(bSelect){
        this.soundSelNode.active = bSelect;
        this.soundUnSelNode.active = !bSelect;
    },

    onBtnMusic(){
        cc.audioEngine.playEffect("btn2");
        var musicMuted = !cc.audioEngine.getMusicMuted()
        this.setMusicBtnSelect(!musicMuted)
        cc.audioEngine.setMusicMuted(musicMuted)
        // // todo test
        // setUnlockMapId(getUnlockMapId());
        // setCrystalUnlock(4);
    },

    onBtnSound(){
        cc.audioEngine.playEffect("btn2");
        var soundMuted = !cc.audioEngine.getEffectMuted()
        this.setSoundBtnSelect(!soundMuted)
        cc.audioEngine.setEffectMuted(soundMuted)
        // //todo test
        // addCrystalExp(3400);
        // addBaseCryCout(500);
    },

    onBtnClose(){
        cc.audioEngine.playEffect("btn2");
        this.node.active = false;
    },

    onBtnExitGame(){
        cc.audioEngine.playEffect("btn");
        cc.director.preloadScene("LoginScene", function () {
            cc.director.loadScene("LoginScene");
        });
    },
});
