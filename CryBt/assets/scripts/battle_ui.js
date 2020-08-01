cc.Class({
    extends: cc.Component,

    properties: {
        crystal_num : cc.Label,
        total_wave: cc.Label,
        cur_wave: cc.Label,
    },

    onBtnPause(){
        console.log("onBtnPause");
    },

    onBtnSpeedChange(){
        console.log("onBtnSpeedChange");
    },

});
