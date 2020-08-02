
cc.Class({
    extends: cc.Component,
    properties: {
        empty_node: cc.Node,
        sel_node: cc.Node,
        weapon_node: cc.Node,
        weapon: cc.Sprite,
    },
    update (dt) {
        if(this.weaponCfg){
            this.flowMonster = cc.battleScene.monster_wave.getFireMonster(this);
            if (this.flowMonster) {
                var monsterPos = cc.v2(this.flowMonster.node.x, this.flowMonster.node.y);
                var pos = cc.v2(this.node.x, this.node.y);
                var dir = monsterPos.sub(pos);
                var ang = Math.acos(dir.x/Math.sqrt(dir.x*dir.x + dir.y*dir.y))*(180/Math.PI);
                if (dir.y < 0) {
                    this.weapon.node.angle = -ang + 90;
                } else {
                    this.weapon.node.angle = ang + 90;
                }
                // 发射子弹
                this.updateToFire(dt);
            }
        }
    },

    updateToFire(dt){
        this.fireTimer += dt;
        if(this.fireTimer >= checkNum(this.weaponCfg.attSpeed)){
            this.fireTimer = 0;
            cc.battleScene.getBullet().initButtle(this, this.flowMonster);
        }
    },

    initWeapon(){
        this.weaponId = 0;
        this.weaponCfg = null;
        this.empty_node.active = false;
        this.fireTimer = 0;
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
        cc.loader.loadRes("battleImg/" + this.weaponCfg.buttleEffect, cc.SpriteFrame, function (err, spriteFrame) {
            self.buttlePic = spriteFrame;
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
