cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        var AudioMgr = require("audioMgr");
        cc.audioMgr = new AudioMgr();
    },

    // update (dt) {},

    onBtnStartGame(){
        cc.director.preloadScene("mainScene", function () {
            cc.audioMgr.playSound(cc.soundId.btn);
            cc.director.loadScene("mainScene");
        });
    }
});
