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
       this.resetBattleUi();
    },

    resetBattleUi(mapConfig){
        this.one_speed.active = !cc.gameDoubleSpeed;
        this.double_speed.active = cc.gameDoubleSpeed;
        if(mapConfig){
            this.crystal_num.string = mapConfig.startMoney;
            this.total_wave.string = Object.keys(mapConfig.monsterWave).length;
        }
    },

    onBtnPause(){
        this.pause_node.active = true;
        cc.director.pause();
    },

    onBtnSpeedChange(){
        cc.gameDoubleSpeed = !cc.gameDoubleSpeed;
        this.one_speed.active = !cc.gameDoubleSpeed;
        this.double_speed.active = cc.gameDoubleSpeed;
    },

    onBtnStartGame(){
        this.pause_node.active = false;
        cc.director.resume();
    },

    onBtnRestart(){
        this.pause_node.active = false;
        cc.director.resume();
        cc.battleScene.onGameRestart();
    },

    onBtnSelMap(){
        this.pause_node.active = false;
        cc.director.resume();
        cc.battleScene.onBackMenuScene();
    },

});
