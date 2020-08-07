cc.Class({
    extends: cc.Component,

    properties: {
        crystal_num : cc.Label,
        total_wave: cc.Label,
        cur_wave: cc.Label,

        one_speed: cc.Node,
        double_speed: cc.Node,
        pause_node: cc.Node,
    },

    onLoad(){
        this.bDoubleSpeed = false;
        this.one_speed.active = !this.bDoubleSpeed;
        this.double_speed.active = this.bDoubleSpeed;
    },

    onBtnPause(){
        this.pause_node.active = true;
    },

    onBtnSpeedChange(){
        this.bDoubleSpeed = !this.bDoubleSpeed;
        this.one_speed.active = !this.bDoubleSpeed;
        this.double_speed.active = this.bDoubleSpeed;
    },

    onBtnStartGame(){
        this.pause_node.active = false;
    },

    onBtnRestart(){
        this.pause_node.active = false;
    },

    onBtnSelMap(){
        this.pause_node.active = false;
    },

});
