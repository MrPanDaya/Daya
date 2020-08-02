cc.Class({
    extends: cc.Component,

    properties: {
        crystal_num : cc.Label,
        total_wave: cc.Label,
        cur_wave: cc.Label,

        one_speed: cc.Node,
        double_speed: cc.Node,
    },

    onLoad(){
        this.bDoubleSpeed = false;
        this.one_speed.active = !this.bDoubleSpeed;
        this.double_speed.active = this.bDoubleSpeed;
    },

    onBtnPause(){
        console.log("onBtnPause");
    },

    onBtnSpeedChange(){
        this.bDoubleSpeed = !this.bDoubleSpeed;
        this.one_speed.active = !this.bDoubleSpeed;
        this.double_speed.active = this.bDoubleSpeed;
    },

});
