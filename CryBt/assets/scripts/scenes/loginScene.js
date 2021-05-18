
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {
        cc.audioEngine.start();
        cc.audioEngine.setHoldingEffects([
            "btn", "btn2"
        ]);
    },
    start () {
        cc.audioEngine.playMusic("menu0")
    },
    update (dt) {
        cc.audioEngine.updateEffect();
    },

    onBtnStartGame(){
        cc.audioEngine.playEffect("btn")
        cc.director.preloadScene("MenuScene", function () {
            cc.director.loadScene("MenuScene");
        });
    }

});
