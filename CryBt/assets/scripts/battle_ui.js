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
        if(window.wx){
            var upNode = this.node.getChildByName("up_node");
            var bpWidget = upNode.getChildByName("btn_pause").getComponent(cc.Widget);
            bpWidget.right += 100
            var bsWidget = upNode.getChildByName("btn_speed").getComponent(cc.Widget);
            bsWidget.right += 80
        }
    },

    resetBattleUi(mapConfig){
        this.one_speed.active = !cc.gameDoubleSpeed;
        this.double_speed.active = cc.gameDoubleSpeed;
        if(mapConfig){
            this.total_wave.string = Object.keys(mapConfig.monsterWave).length;
        }
    },

    updateMoney(money){
        this.crystal_num.string = money;
    },

    onBtnPause(){
        cc.audioEngine.playEffect("btn2");
        this.pause_node.active = true;
        cc.director.pause();
    },

    onBtnSpeedChange(){
        cc.audioEngine.playEffect("btn");
        cc.gameDoubleSpeed = !cc.gameDoubleSpeed;
        this.one_speed.active = !cc.gameDoubleSpeed;
        this.double_speed.active = cc.gameDoubleSpeed;
    },

    onBtnStartGame(){
        cc.audioEngine.playEffect("btn");
        this.pause_node.active = false;
        cc.director.resume();
    },

    onBtnRestart(){
        cc.audioEngine.playEffect("btn");
        this.pause_node.active = false;
        cc.director.resume();
        cc.battleScene.onGameRestart();
    },

    onBtnSelMap(){
        cc.audioEngine.playEffect("btn2");
        this.pause_node.active = false;
        cc.director.resume();
        cc.battleScene.onBackMenuScene();
    },

});
