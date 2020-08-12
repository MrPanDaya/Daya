cc.Class({
    extends: cc.Component,

    properties: {
        pic0: cc.Sprite,
        pic1: cc.Sprite,
    },

    initCrystalShow(cryId){
        var self = this;
        var imgPath = "menuImg/crystal" + cryId ;
        cc.loader.loadRes(imgPath + "_0", cc.SpriteFrame, function (err, spriteFrame) {
            self.pic0.spriteFrame = spriteFrame;
        });
        cc.loader.loadRes(imgPath + "_1", cc.SpriteFrame, function (err, spriteFrame) {
            self.pic1.spriteFrame = spriteFrame;
        });
    },
});
