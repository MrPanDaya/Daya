cc.Class({
    extends: cc.Component,
    properties: {
    },

    update (dt) {
        if(cc.isGameEnd) return;
        this.updateBullet(dt);
        if(cc.gameDoubleSpeed)
            this.updateBullet(dt);
    },

    updateBullet(dt){
        if(this.flowMonster && this.node.active){
            if(this.bulletType === bulletType.ray_cricle && this.node.scale < 1.2){
                this.node.scale = Math.min(this.node.scale + 10*dt, 1.2);
            }
            var monsterPos = cc.v2(this.flowMonster.node.x, this.flowMonster.node.y);
            var pos = cc.v2(this.node.x, this.node.y);
            var dir = monsterPos.sub(pos);
            if(this.bulletType === bulletType.ray_line){
                this.node.angle = this.weapon.weapon.node.angle;
                this.node.height = dir.mag() - 20;
            }else{
                this.speed += (dt * this.addSpeed);
                dir = dir.normalize();
                dir.mulSelf(dt * this.speed * 64);
                this.node.x += dir.x;
                this.node.y += dir.y;

                if(dir.x > 0 && this.node.x >= monsterPos.x || dir.x < 0 && this.node.x <= monsterPos.x){
                    this.node.x = monsterPos.x;
                }
                if(dir.y > 0 && this.node.y >= monsterPos.y || dir.y < 0 && this.node.y <= monsterPos.y){
                    this.node.y = monsterPos.y;
                }
                if(this.node.x == monsterPos.x && this.node.y == monsterPos.y){
                    this.onAttectMonster();
                    cc.battleScene.backBullet(this.node);
                }
            }
        }
    },
    // 激光射线的跟随
    updateRayLineBullet(flowMonster){
        this.node.active = true;
        this.flowMonster = flowMonster;
        this.flowMonster.onAttected(this.weaponCfg);
    },

    initBullet(weapon, flowMonster){
        this.flowMonster = flowMonster;
        this.weapon = weapon;
        this.weaponCfg = weapon.weaponCfg;
        this.bulletType = checkNum(this.weaponCfg.bulletType);
        this.speed = checkNum(this.weaponCfg.bulletSpeed);
        this.addSpeed = checkNum(this.weaponCfg.bulletAccSpeed);
        this.hitRadius = checkNum(this.weaponCfg.bulletRadius);
        this.sound = this.weaponCfg.sound;

        if(this.bulletType === bulletType.ray_line){
            this.node.anchorY = 1;
        }else{
            this.node.anchorY = 0.5;
        }
        if(this.bulletType === bulletType.ray_cricle){
            this.node.scale = 0.5;
        }else{
            this.node.scale = 1;
        }
        this.node.x = weapon.node.x;
        this.node.y = weapon.node.y;
        this.node.angle = weapon.weapon.node.angle;
        this.node.getComponent(cc.Sprite).spriteFrame = weapon.bulletPic;
        this.node.active = true;
    },

    onAttectMonster(){
        this.flowMonster.onAttected(this.weaponCfg);
        if(this.hitRadius > 0){
            var monsterList = cc.battleScene.monster_wave.getFireMonsterList(this.flowMonster, this.hitRadius);
            for(var i = 0, len = monsterList.length; i < len; ++i){
                monsterList[i].onAttected(this.weaponCfg, true);
            }
        }
    },

});
