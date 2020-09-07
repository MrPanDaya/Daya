/*
* 描述：氮气动画类
* */
cc.Class({
    extends: cc.Component,

    properties: {
        gas0: cc.Animation,
        gas1: cc.Animation,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    /*
    * 描述：播放左右氮气的动画
    * */
    start () {
        this.gas0.play("gasAni");
        this.gas1.play("gasAni");
    },

    // update (dt) {},
});
