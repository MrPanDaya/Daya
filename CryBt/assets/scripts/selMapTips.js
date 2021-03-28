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
        window.audioMgr.playSound(cc.soundId.btn);
        this.node.active = false;
    },

    onBtnEnterMap(){
        window.audioMgr.playSound(cc.soundId.btn);
        if((checkNum(this.selMapId) > checkNum(getUnlockMapId()))){
            cc.menuScene.showTips("该地图未解锁，暂不能进入！");
            return;
        }
        cc.curSelMapId = this.selMapId;
        cc.director.preloadScene("BattleScene", function () {
            cc.director.loadScene("BattleScene");
        });
    },

});
