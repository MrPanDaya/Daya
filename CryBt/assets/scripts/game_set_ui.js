cc.Class({
    extends: cc.Component,

    properties: {
        musicSelNode: cc.Node,
        musicUnSelNode: cc.Node,

        soundSelNode: cc.Node,
        soundUnSelNode: cc.Node,
    },
    onLoad () {
        this.setMusicBtnSelect(window.bPlayMainMenu)
        this.setSoundBtnSelect(window.bPlaySound)
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
        window.audioMgr.playSound(cc.soundId.btn2);
        window.bPlayMainMenu = !window.bPlayMainMenu;
        LocalStorage.setBool("muteMusic", window.bPlayMainMenu)
        this.setMusicBtnSelect(window.bPlayMainMenu)
        if(!window.bPlayMainMenu){
            window.audioMgr.stopMainMenu();
        }else {
            window.audioMgr.playMainMenu();
        }
        // // todo test
        // setUnlockMapId(getUnlockMapId());
        // setCrystalUnlock(4);
    },

    onBtnSound(){
        window.audioMgr.playSound(cc.soundId.btn2);
        window.bPlaySound = !window.bPlaySound;
        LocalStorage.setBool("muteSound", window.bPlaySound)
        this.setSoundBtnSelect(window.bPlaySound)

        // //todo test
        // addCrystalExp(3400);
        // addBaseCryCout(500);
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
