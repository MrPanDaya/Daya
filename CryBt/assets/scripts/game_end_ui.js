
cc.Class({
    extends: cc.Component,

    properties: {
        labExp: cc.Label,
        labCry: cc.Label,
        labExpExt: cc.Label,
        labCryExt: cc.Label,

        winPic: cc.Node,
        losePic: cc.Node,
        starList: [cc.Node],
        starBgList: [cc.Node],
    },

    initGameEndUi(){
        this.node.active = true;
        for(var i = 0; i < this.starList.length; ++i){
            this.starList[i].active = false;
            this.starBgList[i].active = true;
        }
    },

    onBtnRestart(){

    },

    onBtnSelMap(){

    },

});
