
cc.Class({
    extends: cc.Component,
    properties: {
        empty_node: cc.Node,
        sel_node: cc.Node,
        weapon_node: cc.Node,
        weapon: cc.Sprite
    },

    update (dt) {
        var fireMonster = cc.battleScene.monster_wave.getFireMonster(this);
    },

    initWeapon(){
        this.weaponId = 0;
        this.weaponCfg = null;
        this.empty_node.active = false;
        this.onWeaponUnSel();
    },

    onWeaponGirdSel(){
        cc.battleScene.onWeaponSelected(this);
        this.selected = true;
        if(!this.weaponId){
            this.empty_node.active = false;
            this.weapon_node.active = false;
            this.sel_node.active = true;
            this.sel_node.getComponent(cc.Animation).play("grid_state", 0);
            cc.battleScene.showWeaponTips(this);
        }else {
            cc.battleScene.showLvupWeaponNode(this);
        }
    },

    onWeaponUnSel(){
        this.selected = false;
        if(!this.weaponId){
            this.sel_node.active = false;
            this.weapon_node.active = false;
            if(!this.empty_node.active){
                this.empty_node.active = true;
                this.empty_node.getComponent(cc.Animation).play("weaponEmpty", 0);
            }
        }
    },

    buildWeapon(weaponId){
        // console.log("build weapon:" + weaponId);
        this.weaponId = weaponId;
        this.weaponCfg = weaponCfgList[weaponId+""];
        var self = this;
        cc.loader.loadRes("battleImg/" + this.weaponCfg.assertName, cc.SpriteFrame, function (err, spriteFrame) {
            self.weapon.spriteFrame = spriteFrame;
        });
        cc.loader.loadRes("battleImg/" + this.weaponCfg.backPic, cc.SpriteFrame, function (err, spriteFrame) {
            self.weapon_node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            self.weapon_node.active = true;
            self.sel_node.active = false;
            self.empty_node.active = false;
        });
    },

    buildNextLevel() {
        if (!this.weaponCfg) return;
        cc.battleScene.data.money -= 200;
        if(this.weaponCfg.nextLevelId !== "0"){
            this.buildWeapon(this.weaponCfg.nextLevelId);
        }
    },

    dropWeapon(){
        this.initWeapon();
    },

    isMaxLevel(){
        return (this.weaponCfg && this.weaponCfg.nextLevelId === "0");
    },

    getNextLvCost(){
        if(this.weaponCfg && this.weaponCfg.nextLevelId !== "0"){
            var nextLvCfg = weaponCfgList[this.weaponCfg.nextLevelId];
            return nextLvCfg.buildMoney;
        }
        return "MAX";
    },
});
