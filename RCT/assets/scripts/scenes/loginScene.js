/*
* 描述：登录场景类
* */
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    /*
    * 描述：初始化
    * */
    onLoad () {
        window.audioMgr.init();
        window.uiHelper.initHelper();
        initWXEvent();
    },

    /*
    * 描述：开始
    * */
    start () {
        this.startEffect0 = cc.find('Canvas/login_node/start_effect_0');
        this.startEffect0.opacity = 0;
        this.startEffect1 = cc.find('Canvas/login_node/start_effect_1');
        this.startEffect1.opacity = 0;
        initADList(0);
    },

    // update (dt) {},

    /*
    * 描述：开始游戏按钮的点击回调
    * */
    onBtnStartGame(){
        this.runStartEffect(function(){
            cc.director.preloadScene("selRoleScene", function () {
                window.audioMgr.playSound(cc.soundId.btn);
                cc.director.loadScene("selRoleScene");
            });
        });
    },

    /*
    * 描述：播放开始按钮的动画
    * */
    runStartEffect(callback){
        this.startEffect0.runAction(cc.fadeTo(0.2, 255));
        var callfun = cc.callFunc(function(){
            if(callback) callback();
        })
        this.startEffect1.runAction(cc.sequence(cc.fadeTo(0.2, 255), callfun));
    },
});
