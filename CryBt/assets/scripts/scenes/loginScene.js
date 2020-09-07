
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // onLoad () {},
    start () {
        audioMgr.playMainMenu("menu0");
    },
    // update (dt) {},

    onBtnStartGame(){
        cc.director.preloadScene("MenuScene", function () {
            cc.director.loadScene("MenuScene");
        });
    }

});
