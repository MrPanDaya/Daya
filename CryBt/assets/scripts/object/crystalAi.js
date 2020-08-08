cc.Class({
    extends: cc.Component,

    properties: {
        cryPicNode1: cc.Node,
        cryPicNode2: cc.Node,
        bloodSprite: cc.Sprite,
        bloodPicList: [cc.SpriteFrame],
    },
    initCrystal(index){
        this.crystalHp = 5;
        this.bloodSprite.spriteFrame = this.bloodPicList[this.crystalHp];

        var self = this;
        cc.loader.loadRes("battleImg/crystal"+ index + "_1", cc.SpriteFrame, function (err, spriteFrame) {
            self.cryPicNode1.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        cc.loader.loadRes("battleImg/crystal"+ index + "_2", cc.SpriteFrame, function (err, spriteFrame) {
            self.cryPicNode2.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });

        var del = cc.delayTime(1);
        var callFun = cc.callFunc(function () {
            self.cryPicNode1.active = !self.cryPicNode1.active;
            self.cryPicNode2.active = !self.cryPicNode2.active;
        });
        this.node.runAction(cc.sequence(del, callFun).repeatForever());
    },
    decBlood(){
        if(this.crystalHp > 0){
            this.crystalHp -= 1;
            if(this.crystalHp <= 0){
                this.crystalHp = 0;
                cc.battleScene.onGameEnd();
            }
            this.bloodSprite.spriteFrame = this.bloodPicList[this.crystalHp];
        }
        return this.crystalHp > 0;
    },
});
