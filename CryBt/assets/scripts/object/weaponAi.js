
cc.Class({
    extends: cc.Component,
    properties: {
        empty_node: cc.Node,
        sel_node: cc.Node,
        weapon_node: cc.Node,
        weapon: cc.Sprite,
        add_power_node: cc.Node,
    },
    update (dt) {
        if(cc.isGameEnd) return;
         this.updateWeapon(dt);
        if(cc.gameDoubleSpeed)
            this.updateWeapon(dt);
    },

    updateWeapon(dt){
        if(!this.weaponCfg) return;

        this.updateRayCricleBullet(dt);

        this.fireTimer += dt;
        if(this.fireTimer >= checkNum(this.weaponCfg.attSpeed)){
            this.fireTimer = 0;
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
                cc.audioEngine.playEffect("battle/"+this.weaponCfg.sound)
                if(this.bulletType === bulletType.ray_line) {
                    if (!this.rayLineBullet) {
                        this.rayLineBullet = cc.battleScene.getBullet();
                        this.rayLineBullet.initBullet(this, this.flowMonster);
                    }
                    this.rayLineBullet.updateRayLineBullet(this.flowMonster);
                }
                else if(this.bulletType === bulletType.ray_cricle){
                    this.ryaCricleNum = 3;
                    this.ryaCricleTimer = 0;
                    this.criFlowMonster = this.flowMonster;
                }else{
                    cc.battleScene.getBullet().initBullet(this, this.flowMonster);
                }
            }else{
                if(this.rayLineBullet) this.rayLineBullet.node.active = false;
            }
        }
    },

    updateRayCricleBullet(dt){
        if(this.bulletType !== bulletType.ray_cricle) return;
        if(this.ryaCricleNum > 0){
            this.ryaCricleTimer += dt;
            if(this.ryaCricleTimer > 0.05){
                this.ryaCricleNum --;
                this.ryaCricleTimer = 0;
                this.criFlowMonster && cc.battleScene.getBullet().initBullet(this, this.criFlowMonster);
            }
        }
    },

    initWeapon(){
        this.weaponId = 0;
        this.weaponCfg = null;
        this.bulletType = 0;
        this.empty_node.active = false;
        this.fireTimer = 0;
        this.ryaCricleNum = 0;
        this.ryaCricleTimer = 0;
        this.onWeaponUnSel();
        if(this.rayLineBullet){
            cc.battleScene.backBullet(this.rayLineBullet.node);
            this.rayLineBullet = null;
        }
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
        var weaponCfg = weaponCfgList[weaponId+""];
        var buildMoney = checkNum(weaponCfg.buildMoney);
        if(buildMoney > cc.battleScene.data.money){
            cc.battleScene.showTips("能量不足!");
            return false;
        }
        // 扣除能力
        cc.battleScene.changeBattlMoney(-buildMoney);

        this.add_power_node.active = false;
        if(LocalData.selCrystalId === crystalType.AddPowerBuff){
            this.crystalData = getCrystalAtt1(LocalData.selCrystalId);
            this.add_power_node.active = (this.crystalData.att > 0);
        }
        this.weaponId = weaponId;
        this.weaponCfg = weaponCfg;
        this.bulletType = checkNum(this.weaponCfg.bulletType);
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
        cc.loader.loadRes("battleImg/" + this.weaponCfg.bulletEffect, cc.SpriteFrame, function (err, spriteFrame) {
            self.bulletPic = spriteFrame;
            if(self.rayLineBullet){
                self.rayLineBullet.initBullet(self, null);
            }
        });
        return true
    },

    buildNextLevel() {
        if (!this.weaponCfg) return;
        if(this.weaponCfg.nextLevelId !== "0"){
            if(this.buildWeapon(this.weaponCfg.nextLevelId)){
                cc.audioEngine.playEffect("battle/upgrade")
            }
        }
    },

    dropWeapon(){
        cc.audioEngine.playEffect("battle/towersell")
        cc.battleScene.changeBattlMoney(checkNum(this.weaponCfg.dropMoney));
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
    onDestroy(){
        if(this.rayLineBullet){
            cc.battleScene.backBullet(this.rayLineBullet.node);
            this.rayLineBullet = null;
        }
    },
});
