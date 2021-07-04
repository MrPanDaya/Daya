// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        df_node: cc.Node,
        road_id: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.bSel = false
        this.setSelect(this.bSel)
        this.road_id.node.active = false
    },

    start () {

    },

    setSelect(bSel){
        this.df_node.active = !bSel
        // if(!bSel){
        //     this.df_node.runAction(cc.sequence(cc.fadeIn(2), cc.fadeOut(2)).repeatForever());
        // }
    },

    onSelect(){
        this.bSel = !this.bSel
        this.setSelect(this.bSel)
    },

    // update (dt) {},
});
