
cc.Class({
    extends: cc.Component,

    properties: {

    },

    initWeapon(id, weaponCfg){
        this.index = id;
        this.weaponCfg = weaponCfg;
        if(id == 0){
            this.node.getChildByName("sel_pic").active = true;
        }
        var self = this;
        cc.loader.loadRes("battleImg/" + weaponCfg.normalBtn, cc.SpriteFrame, function (err, spriteFrame) {
            self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            var costLab = self.node.getChildByName("cost").getComponent(cc.Label);
            costLab.string = weaponCfg.buildMoney;
        });
    },

    onSelected(){
        console.log("build " + this.weaponCfg.id);
        cc.battleScene.buildWeapon(this.weaponCfg.id);
        cc.battleScene.hideWeaponTips();
    },

});
