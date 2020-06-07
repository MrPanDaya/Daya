cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {
        cc.uiLvlup = this;
    },

    start () {},

    // update (dt) {},

    setSelId(selId){
        this.selId = selId || 0;
        console.log("selid:" + this.selId);
    },

    onClose(){
        this.node.active = false;
    },
    onLvlup(){

    },
    onLvlupByAd(){

    }
});
