
cc.Class({
    extends: cc.Component,

    properties: {
        monsterPrefab : cc.Prefab,
    },

    update (dt) {

    },

    initConfig(monsterWaveCfg){
        this.monsterWaveCfg = monsterWaveCfg;
        this.waveId = 0;
    },

    startGame(roadCfg){
        if(!this.monsterWaveCfg) return;
        this.roadCfg = roadCfg;
        this.startNextWave();
    },

    updateWave(){
        if(this.gameEnd){
            return;
        }
        var bWeaveEnd = true;
        for(var i = 0; i < this.monsterList.length; ++i){
            if(!this.monsterList[i].stopMove){
                bWeaveEnd = false;
                return;
            }
        }
        if(bWeaveEnd){
            this.startNextWave();
        }
    },

    startNextWave(){
        this.waveId += 1;
        var waveCfg = this.monsterWaveCfg[this.waveId - 1];
        if (!waveCfg) {
            console.log("success the game end !");
            return;
        }
        cc.battleScene.setCurWave(this.waveId);
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
        var index = 0;
        var del = cc.delayTime(1.2);
        var callFun = cc.callFunc(function () {
            index++;
            var len = this.monsterList.length;
            this.monsterList[len - index].startMove(this.roadCfg);
        }.bind(this))
        this.node.runAction(cc.sequence(del, callFun).repeat(this.monsterList.length));
    },

    getFireMonster(weapon){
        // for(var i = 0, len = this.monsterList.length; i < len; ++i){
        //     var monster = this.monsterList[i];
        //     if(monster && monster.node.active){
        //
        //     }
        // }
        return null;
    },

});
