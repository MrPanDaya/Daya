cc.Class({
    extends: cc.Component,

    properties: {
        pic0: cc.Sprite,
        pic1: cc.Sprite,
        cryText0: cc.Sprite,
        cryText1: cc.Sprite,

        cryLv: cc.Label,
        attLab0: cc.Label,
        attLab1: cc.Label,

        cryCostLab: cc.Label,
        expCostLab: cc.Label,

        changeCryNode: cc.Node,
    },

    initLvupUi(cryId){
        this.selCryId = cryId;
        var self = this;
        cc.loader.loadRes("menuImg/crystal" + cryId + "_0", cc.SpriteFrame, function (err, spriteFrame) {
            self.pic0.spriteFrame = spriteFrame;
            self.pic1.spriteFrame = spriteFrame;
        });
        cc.loader.loadRes("menuImg/crystalText" + cryId, cc.SpriteFrame, function (err, spriteFrame) {
            self.cryText0.spriteFrame = spriteFrame;
            self.cryText1.spriteFrame = spriteFrame;
        });

        this.resetCrystalData();
    },

    resetCrystalData(){
        var userCryData = getCrystalData(this.selCryId);
        if(isCrystalMaxLv(this.selCryId, userCryData.lv)){
            cc.menuScene.showTips("已是最高级!");
        }
        this.cryLv.string = userCryData.lv;
        var curExp = userCryData.curExp;
        var curBaseCryCount = LocalData.baseCryCount;
        var cryAtt = getCrystalAtt(this.selCryId, userCryData.lv);
        var cryNextAtt = getCrystalAtt(this.selCryId, userCryData.lv + 1);

        this.attLab0.string = "+" + Math.floor(cryAtt.att * 100) +  "%";
        this.attLab1.string = "+" + Math.floor(cryNextAtt.att * 100) +  "%";

        this.cryCostLab.string = curBaseCryCount + "/" + cryNextAtt.baseCry;
        this.expCostLab.string = curExp + "/" + cryNextAtt.exp;
    },

    onBtnClose(){
        this.node.active = false;
    },

    onBtnLvup(){
        var result = setCrystalLvUp(this.selCryId);
        var sTips = "升级成功!";
        if(result === -1){
            sTips = "该水晶未解锁!";
        }else if(result === -2){
            sTips = "已是最高级!";
        }else if(result === -3){
            sTips = "原水晶不足!";
        }else if(result === -4){
            sTips = "水晶经验不足!";
        }
        cc.menuScene.showTips(sTips);
        if(result === 0){
            this.resetCrystalData();
            this.changeCryNode.getComponent("change_cry_ui").resetCrystalData();
        }
    },
});
