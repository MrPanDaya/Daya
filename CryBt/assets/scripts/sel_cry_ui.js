cc.Class({
    extends: cc.Component,

    properties: {
        changeCryNode: cc.Node,
        cryShowNode: cc.Node,
        gameSetNode: cc.Node,
    },

    onLoad () {
        this.cryIndex = 0;
        this.node.runAction(cc.sequence(cc.delayTime(15), cc.callFunc(function () {
            // var index = Math.floor(Math.random()*5);
            this.cryIndex++;
            if(this.cryIndex > 4) this.cryIndex = 0;
            this.cryShowNode.getComponent("crystalShow").initCrystalShow(this.cryIndex);
        }.bind(this))).repeatForever())
    },

    onBtnSelCrystal(){
        cc.audioEngine.playEffect("btn");
        this.changeCryNode.active = true;
        this.changeCryNode.getComponent("change_cry_ui").resetCrystalData();
    },
    onBtnGameSet(){
        cc.audioEngine.playEffect("btn2");
        this.gameSetNode.active = true;
        console.log("onBtnGameSet");
    },
    onBtnShare(){
        var args = {};
        args.title = "星域告急通知书";
        args.desc = "星域基地告急，外形生物正在大举入侵，战士们赶紧集合啊~";
        shareByMiniGame(args);
    },
});
