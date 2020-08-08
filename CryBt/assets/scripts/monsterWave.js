
cc.Class({
    extends: cc.Component,

    properties: {
        monsterPrefab : cc.Prefab,
    },

    update(dt){
        if(this.monsterWaveCfg){
            this.bornTimer += dt;
            var timer = cc.gameDoubleSpeed ? 0.6 : 1.2;
            if(this.bornTimer >= timer){
                this.bornTimer = 0;
                this.bornIndex ++;
                var id = this.monsterList.length - this.bornIndex;
                if(id >= 0) this.monsterList[id].startBorn(this.roadCfg);
            }
        }
    },

    initConfig(monsterWaveCfg){
        this.monsterWaveCfg = monsterWaveCfg;
        this.waveId = 0;
        this.bornTimer = 0;
    },

    startGame(roadCfg){
        if(!this.monsterWaveCfg) return;
        this.roadCfg = roadCfg;
        this.startNextWave();
    },

    startNextWave(){
        if(this.waveId > Object.keys(this.monsterWaveCfg).length) return;
        this.waveId += 1;
        var waveCfg = this.monsterWaveCfg[this.waveId - 1];
        if (!waveCfg) {
            cc.battleScene.onGameEnd();
            return;
        }
        cc.battleScene.setCurWave(this.waveId);

        this.bornIndex = 0;
        this.monsterList = [];
        for (var i = waveCfg.length - 1; i >= 0; --i) {
            var monsterId = waveCfg[i];
            var monsterCfg = monsterCfgList[monsterId + ""];
            for (var j = monsterCfg.num - 1; j >= 0; --j) {
                var monsterNode = cc.instantiate(this.monsterPrefab);
                this.node.addChild(monsterNode);
                var monster = monsterNode.getComponent("monsterAi");
                monster.initMonster(monsterCfg);
                this.monsterList.push(monster);
            }
        }
    },

    getFireMonster(weapon){
        if(!this.monsterList || !weapon) return null;
        var selMonster = null;
        for(var i = 0, len = this.monsterList.length; i < len; ++i){
            var monster = this.monsterList[i];
            if(monster && monster.monsterHp > 0 && monster.node.active){
                var weaponPos = cc.v2(weapon.node.x, weapon.node.y);
                var monsterPos = cc.v2(monster.node.x, monster.node.y);
                var dis = weaponPos.sub(monsterPos).mag();
                if(dis < weapon.weaponCfg.attRadius * 64){
                    if(!selMonster || selMonster.nextRoadId < monster.nextRoadId){
                        selMonster = monster;
                    }
                }
            }
        }
        return selMonster;
    },

    checkMonster(){
        var isAllDeath = true;
        for(var i = 0; i < this.monsterList.length; ++i){
            if(this.monsterList[i].monsterHp > 0){
                isAllDeath = false;
                break;
            }
        }
        // 下一波
        if(isAllDeath){
            this.startNextWave();
        }
    },

});
