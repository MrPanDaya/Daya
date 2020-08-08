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
        this.one_speed.active = !cc.gameDoubleSpeed;
        this.double_speed.active = cc.gameDoubleSpeed;
    },

    onBtnPause(){
        this.pause_node.active = true;
        cc.battleScene.onGamePause();
    },

    onBtnSpeedChange(){
        cc.gameDoubleSpeed = !cc.gameDoubleSpeed;
        this.one_speed.active = !cc.gameDoubleSpeed;
        this.double_speed.active = cc.gameDoubleSpeed;
    },

    onBtnStartGame(){
        this.pause_node.active = false;
        cc.battleScene.onGameResume();
    },

    onBtnRestart(){
        this.pause_node.active = false;
        cc.battleScene.onGameRestart();
    },

    onBtnSelMap(){
        this.pause_node.active = false;
    },

});
