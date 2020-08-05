cc.Class({
    extends: cc.Component,

    properties: {
        selMapPic: cc.Sprite,
    },
    // onLoad () {},
    // start () {},
    // update (dt) {},

    initSelMap(mapId){
        this.selMapId = mapId;
        var self = this;
        cc.loader.loadRes("selMap/Map" + this.selMapId, cc.SpriteFrame, function (err, spriteFrame) {
            self.selMapPic.spriteFrame = spriteFrame;
            self.node.active = true;
        });
    },

    onBtnClose(){
        this.node.active = false;
    },

    onBtnEnterMap(){
        cc.curSelMapId = this.selMapId;
        cc.director.preloadScene("BattleScene", function () {
            cc.director.loadScene("BattleScene");
        });
    },

});
