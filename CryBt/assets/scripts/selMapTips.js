cc.Class({
    extends: cc.Component,

    properties: {
        selMapPic: cc.Sprite,
    },

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
        if((checkNum(this.selMapId) > checkNum(getUnlockMapId()))){
            cc.menuScene.showTips("未解锁该地图，暂不能进入！");
            return;
        }
        cc.curSelMapId = this.selMapId;
        cc.director.preloadScene("BattleScene", function () {
            cc.director.loadScene("BattleScene");
        });
    },

});
