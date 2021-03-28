
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // onLoad () {},
    start () {
        audioMgr.init()
        audioMgr.playMainMenu("menu0");
    },
    // update (dt) {},

    onBtnStartGame(){
        window.audioMgr.playSound(cc.soundId.btn);
        cc.director.preloadScene("MenuScene", function () {
            cc.director.loadScene("MenuScene");
        });
    }

});
