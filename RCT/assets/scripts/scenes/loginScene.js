cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var audioMgr = require("audioMgr");
        cc.audioMgr = new audioMgr();
    },

    start () {
        this.startEffect0 = cc.find('Canvas/login_node/start_effect_0');
        this.startEffect0.opacity = 0;
        this.startEffect1 = cc.find('Canvas/login_node/start_effect_1');
        this.startEffect1.opacity = 0;
    },

    // update (dt) {},

    onBtnStartGame(){
        this.runStartEffect(function(){
            cc.director.preloadScene("selRoleScene", function () {
                cc.audioMgr.playSound(cc.soundId.btn);
                cc.director.loadScene("selRoleScene");
            });
        });
    },

    runStartEffect(callback){
        this.startEffect0.runAction(cc.fadeTo(0.2, 255));
        var callfun = cc.callFunc(function(){
            if(callback) callback();
        })
        this.startEffect1.runAction(cc.sequence(cc.fadeTo(0.2, 255), callfun));
    },
});
