
cc.Class({
    extends: cc.Component,
    properties: {
        deathEff_prefab: cc.Prefab,
        dizzyEff_prefab: cc.Prefab,
        cryAttEff_prefab: cc.Prefab,
        monsterNode: cc.Node,
        hpNode: cc.Node,
        hpPicNode: cc.Node,
        decSpeedNode: cc.Node,
    },
    onLoad () {
        this.oldScale = this.monsterNode.scale;
        this.node.active = false;
    },
    // start () {},
    update (dt) {
        if(cc.isGameEnd) return;
        this.updateMonster(dt);
        if(cc.gameDoubleSpeed)
            this.updateMonster(dt);
    },

    updateMonster(dt){
        if(this.isBorn && this.roadCfg && this.monsterHp > 0){
            // 眩晕停止移动
            this.dizzyTimer -= dt;
            this.dizzyTimer = Math.max(this.dizzyTimer, 0);
            if(this.dizzyTimer > 0) return;
            // 移动
            this.dizzyEffect && (this.dizzyEffect.active = false);
            var nexPos = this.getNextPos();
            var dir = nexPos.sub(cc.v2(this.node.x, this.node.y));
            dir = dir.normalize();
            dir.mulSelf(dt * checkNum(this.monsterCfg.maxSpeed) * 64);
            this.node.x += (dir.x * this.speedScale);
            this.node.y += (dir.y * this.speedScale);
            if(dir.x > 0 && this.node.x >= nexPos.x || dir.x < 0 && this.node.x <= nexPos.x){
                this.node.x = nexPos.x;
            }
            if(dir.y > 0 && this.node.y >= nexPos.y || dir.y < 0 && this.node.y <= nexPos.y){
                this.node.y = nexPos.y;
            }
            if(this.node.x === nexPos.x && this.node.y === nexPos.y){
                this.nextRoadId ++;
                if(this.nextRoadId >= this.totalRoadCount){
                    this.monsterHp = 0;
                    cc.battleScene.crystal.decBlood();
                    cc.battleScene.onMonsterDeath();
                    this.node.removeFromParent();
                }
            }
        }
    },

    initMonster(monsterCfg){
        this.monsterNode.active = true;
        this.monsterNode.scale = this.oldScale * checkNum(monsterCfg.scale);
        this.monsterCfg = monsterCfg;
        this.maxHp = checkNum(this.monsterCfg.maxHp);
        this.monsterHp = this.maxHp;
        this.hpNode.active = false;
        this.hpPicNode.scaleX = 1;
        var action = this.monsterNode.getComponent(cc.Animation);
        cc.loader.loadRes("monster/" + this.monsterCfg.assert, cc.SpriteAtlas, function (err, alt) {
            var clip = cc.AnimationClip.createWithSpriteFrames(alt.getSpriteFrames(), 5);
            clip.name = "m_run";
            clip.wrapMode = cc.WrapMode.Loop;
            action.addClip(clip);
            action.play("m_run", 0);
        });
    },
    startBorn(roadCfg){
        this.node.active = true;
        this.roadCfg = roadCfg;
        this.totalRoadCount = Object.keys(this.roadCfg).length;
        this.isBorn = true;
        this.nextRoadId = 0;
        this.node.x = (this.roadCfg[this.nextRoadId].posX - 6) * 64;
        this.node.y = (this.roadCfg[this.nextRoadId].posY - 3) * 64;
        this.nextRoadId ++;

        // 水晶数据
        this.crystalData = getCrystalAtt1(LocalData.selCrystalId);
        // 眩晕水晶定时器
        this.dizzyTimer = 0;
        // 减速水晶
        this.decSpeedNode.active = false;
        this.speedScale = 1;
        if(LocalData.selCrystalId === crystalType.DecSpeedBuff){
            this.speedScale = (1 - this.crystalData.att);
            if(this.speedScale < 1){
                this.decSpeedNode.active = true;
            }
        }else if(LocalData.selCrystalId === crystalType.DecBornHpBuff){
            this.hpNode.active = true;
            var percent = (1 - this.crystalData.att);
            this.monsterHp = Math.floor(this.maxHp * percent);
            this.hpPicNode.scaleX = percent;
        }
    },
    onDeath(){
        this.roadCfg = null;
        this.crystalData = null;
        cc.battleScene.onMonsterDeath();
        cc.battleScene.changeBattlMoney(checkNum(this.monsterCfg.money))
        this.hpNode.active = false;
        this.monsterNode.active = false;
        this.decSpeedNode.active = false;
        this.dizzyEffect && (this.dizzyEffect.active = false);
        var deathAniNode = cc.instantiate(this.deathEff_prefab);
        this.node.addChild(deathAniNode);
        deathAniNode.getChildByName("lab_money").getComponent(cc.Label).string = "+" + this.monsterCfg.money;
        var deathAni = deathAniNode.getComponent(cc.Animation);
        deathAni.on('finished', function () {
            this.node.removeFromParent();
        }.bind(this));
        deathAni.play("deathEffect", 0);
    },

    onAttected(weaponCfg, bRadiusAtt){
        if(this.monsterHp <= 0) return;
        this.hpNode.active = true;
        var att = checkNum(weaponCfg.att);
        var bulletAttExt = checkNum(weaponCfg.bulletAttExt);
        if(bRadiusAtt) att *= bulletAttExt;
        // 攻击加成水晶
        if(LocalData.selCrystalId === crystalType.AddPowerBuff){
            att += (att * this.crystalData.att);;
        }else if(LocalData.selCrystalId === crystalType.DizzyMonBuff){
            var bulletEffExt = bRadiusAtt ? checkNum(weaponCfg.bulletEffExt) : 0;
            this.runDizzyAni(bulletEffExt);
        }
        this.monsterHp -= att;
        if(this.monsterHp <= 0){
            this.monsterHp = 0;
            this.onDeath();
        }
        var percent = this.monsterHp/this.maxHp;
        this.hpPicNode.scaleX = percent;

        var effect = cc.battleScene.getBulletEffect();
        this.node.addChild(effect);
        effect.active = true;
        effect.getComponent("attEffect").playBulletEffect(weaponCfg.attEffect);
    },

    onAttectedByCrystal(){
        if(this.monsterHp <= 0) return;
        if(LocalData.selCrystalId === crystalType.AttackMonBuff && this.crystalData.att > 0){
            this.hpNode.active = true;
            if(!this.cryAttectEffect){
                this.cryAttectEffect = cc.instantiate(this.cryAttEff_prefab);
                this.node.addChild(this.cryAttectEffect);
            }
            this.cryAttectEffect.active = true;
            var cryAttAni = this.cryAttectEffect.getComponent(cc.Animation);
            cryAttAni.on('finished', function () {
                this.cryAttectEffect.active = false;
            }.bind(this));
            cryAttAni.play("crystalAttEffect", 0);
            // 扣血
            var att = this.maxHp * this.crystalData.att;
            this.monsterHp -= att;
            if(this.monsterHp <= 0){
                this.monsterHp = 0;
                this.onDeath();
            }
            var percent = this.monsterHp/this.maxHp;
            this.hpPicNode.scaleX = percent;
        }
    },

    runDizzyAni(bulletEffExt){
        var result = bulletEffExt > 0 ? this.crystalData.att*bulletEffExt : this.crystalData.att;
        if(Math.random() <= result){
            this.dizzyTimer = bulletEffExt > 0 ? 0.4 : 0.6;  //0.6秒眩晕时间
            if(!this.dizzyEffect){
                this.dizzyEffect = cc.instantiate(this.dizzyEff_prefab);
                this.node.addChild(this.dizzyEffect);
            }
            this.dizzyEffect.active = true;
            this.dizzyEffect.getComponent(cc.Animation).play("dizzyEffect", 0);
        }
    },

    getNextPos(){
        var index = this.nextRoadId;
        if(this.nextRoadId >= this.totalRoadCount)
            index = this.totalRoadCount - 1;
        var nextPos = this.roadCfg[index];
        return cc.v2((nextPos.posX - 6) * 64, (nextPos.posY - 3) * 64);
    },

});
