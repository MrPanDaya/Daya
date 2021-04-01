cc.Class({
    extends: cc.Component,

    properties: {
        attCircleNode: cc.Node,
        cryPicNode1: cc.Node,
        cryPicNode2: cc.Node,
        bloodSprite: cc.Sprite,
        bloodPicList: [cc.SpriteFrame],
    },
    update(dt){
        if(cc.isGameEnd) return;
        if(LocalData.selCrystalId !== crystalType.AttackMonBuff) return;

        this.attTimer += dt;
        if(cc.gameDoubleSpeed) this.attTimer += dt;
        if(this.attTimer < 5) return;

        var monsterList = cc.battleScene.monster_wave.monsterList;
        for(var i = 0, len = monsterList.length; i < len; ++i){
            var monster = monsterList[i];
            if(monster && monster.monsterHp > 0 && monster.node.active){
                var pos = cc.v2(this.node.x, this.node.y);
                var monsterPos = cc.v2(monster.node.x, monster.node.y);
                var dis = pos.sub(monsterPos).mag();
                if(dis < this.attRadius * 64){
                    monster.onAttectedByCrystal();
                    this.attTimer = 0;
                }
            }
        }
    },
    initCrystal(index){
        this.crystalHp = 5;
        this.bloodSprite.spriteFrame = this.bloodPicList[this.crystalHp];
        // 烈焰火晶
        this.attRadius = 4;
        this.attTimer = 0;

        var self = this;
        cc.loader.loadRes("battleImg/crystal"+ index + "_1", cc.SpriteFrame, function (err, spriteFrame) {
            self.cryPicNode1.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        cc.loader.loadRes("battleImg/crystal"+ index + "_2", cc.SpriteFrame, function (err, spriteFrame) {
            self.cryPicNode2.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });

        var del = cc.delayTime(1);
        var callFun = cc.callFunc(function () {
            self.cryPicNode1.active = !self.cryPicNode1.active;
            self.cryPicNode2.active = !self.cryPicNode2.active;
        });
        this.node.runAction(cc.sequence(del, callFun).repeatForever());
    },
    decBlood(){
        if(this.crystalHp > 0){
            cc.audioEngine.playEffect("battle/crash")
            this.crystalHp -= 1;
            if(this.crystalHp <= 0){
                this.crystalHp = 0;
                cc.audioEngine.playEffect("battle/gameover")
                cc.battleScene.onGameEnd();
            }
            this.bloodSprite.spriteFrame = this.bloodPicList[this.crystalHp];
        }
        return this.crystalHp > 0;
    },
    onCrystalSel(){
        if(LocalData.selCrystalId !== crystalType.AttackMonBuff) return;
        this.attCircleNode.active = true;
        this.attCircleNode.scale = this.attRadius;
    },
    onCrystalUnSel(){
        if(LocalData.selCrystalId !== crystalType.AttackMonBuff) return;
        this.attCircleNode.active = false;
    },
});
