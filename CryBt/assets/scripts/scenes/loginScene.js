
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // onLoad () {},
    // start () {},
    // update (dt) {},

    onBtnStartGame(){
        cc.director.preloadScene("MenuScene", function () {
            cc.director.loadScene("MenuScene");
        });
    }

});
