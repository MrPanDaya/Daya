cc.Class({
    extends: cc.Component,

    properties: {
        pic0: cc.Sprite,
        pic1: cc.Sprite,
        cryText0: cc.Sprite,
        cryText1: cc.Sprite,

        attLab0: cc.Label,
        attLab1: cc.Label,

        cryCostLab: cc.Label,
        expCostLab: cc.Label,
    },
    // onLoad () {},
    // start () {},
    // update (dt) {},

    initLvupUi(cryId){
        var self = this;
        cc.loader.loadRes("menuImg/crystal" + cryId + "_0", cc.SpriteFrame, function (err, spriteFrame) {
            self.pic0.spriteFrame = spriteFrame;
            self.pic1.spriteFrame = spriteFrame;
        });
        cc.loader.loadRes("menuImg/crystalText" + cryId, cc.SpriteFrame, function (err, spriteFrame) {
            self.cryText0.spriteFrame = spriteFrame;
            self.cryText1.spriteFrame = spriteFrame;
        });

        this.attLab0.string = "+10%";
        this.attLab1.string = "+15%";

        this.cryCostLab.string = "2/10";
        this.expCostLab.string = "11/15";
    },

    onBtnClose(){
        this.node.active = false;
    },
});
