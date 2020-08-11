cc.Class({
    extends: cc.Component,

    properties: {
        changeCryNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:
    // onLoad () {},
    // start () {},
    // update (dt) {},

    onBtnSelCrystal(){
        this.changeCryNode.active = true;
    },
    onBtnGameSet(){

    },
});
