cc.Class({
    extends: cc.Component,

    properties: {
        changeCryNode: cc.Node,
        cryShowNode: cc.Node,
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
        this.changeCryNode.active = true;
        this.changeCryNode.getComponent("change_cry_ui").resetCrystalData();
    },
    onBtnGameSet(){
        addCrystalExp(LocalData.selCrystalId, 3400);
        addBaseCryCout(500);
        console.log("onBtnGameSet");
    },
});
