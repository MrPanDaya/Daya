cc.Class({
    extends: cc.Component,

    properties: {
        effect1: cc.Sprite,
        effect2: cc.Sprite,
    },

    playBulletEffect(effectName) {
        this.effect1.node.active = false;
        this.effect2.node.active = false;
        var self = this;
        cc.loader.loadRes("battleImg/" + effectName + "_1", cc.SpriteFrame, function (err, spriteFrame) {
            self.effect1.spriteFrame = spriteFrame;
            self.effect1.node.active = true;
        });
        cc.loader.loadRes("battleImg/" + effectName + "_2", cc.SpriteFrame, function (err, spriteFrame) {
            self.effect2.spriteFrame = spriteFrame;
        });

        var del = cc.delayTime(0.1);
        var fun = cc.callFunc(function () {
            self.effect1.node.active = false;
            self.effect2.node.active = true;
        });
        var fun2 = cc.callFunc(function () {
            cc.battleScene.backBulletEffect(self.node);
        });
        this.node.runAction(cc.sequence(fun,del,fun2));
    },

});
