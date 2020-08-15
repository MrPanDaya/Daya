
cc.Class({
    extends: cc.Component,

    properties: {

    },

    update(dt){
        if(this.totalMoney !== cc.battleScene.data.money){
            this.totalMoney = cc.battleScene.data.money;
            this.costNode.color = this.totalMoney >= checkNum(this.weaponCfg.buildMoney) ? this.tmpColor : cc.color(255, 100, 50, 255);
        }
    },

    initWeapon(id, weaponCfg){
        this.totalMoney = 0;
        this.index = id;
        this.weaponCfg = weaponCfg;
        if(id == 0){
            this.node.getChildByName("sel_pic").active = true;
        }
        this.costNode = this.node.getChildByName("cost");
        this.tmpColor = this.costNode.color;
        var self = this;
        cc.loader.loadRes("battleImg/" + weaponCfg.normalBtn, cc.SpriteFrame, function (err, spriteFrame) {
            self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            self.costNode.getComponent(cc.Label).string = weaponCfg.buildMoney;
        });
    },

    onSelected(){
        // console.log("build " + this.weaponCfg.id);
        cc.battleScene.buildWeapon(this.weaponCfg.id);
        cc.battleScene.hideWeaponTips();
    },

});
