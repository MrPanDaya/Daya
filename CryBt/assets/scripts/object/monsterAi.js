
cc.Class({
    extends: cc.Component,
    properties: {
        monsterNode: cc.Node,
        hpNode: cc.Node,
        hpPicNode: cc.Node,
    },
    onLoad () {
        this.oldScale = this.monsterNode.scale;
        this.node.active = false;
    },
    // start () {},
    update (dt) {
        if(!this.stopMove && this.roadCfg){
            var nexPos = this.getNextPos();
            var dir = nexPos.sub(cc.v2(this.node.x, this.node.y));
            dir = dir.normalize();
            dir.mulSelf(dt * checkNum(this.monsterCfg.maxSpeed) * 64);
            this.node.x += dir.x;
            this.node.y += dir.y;
            if(dir.x > 0 && this.node.x >= nexPos.x || dir.x < 0 && this.node.x <= nexPos.x){
                this.node.x = nexPos.x;
            }
            if(dir.y > 0 && this.node.y >= nexPos.y || dir.y < 0 && this.node.y <= nexPos.y){
                this.node.y = nexPos.y;
            }
            if(this.node.x == nexPos.x && this.node.y == nexPos.y){
                this.nextRoadId ++;
                if(this.nextRoadId >= Object.keys(this.roadCfg).length){
                    this.stopMove = true;
                    this.node.active = false;
                    // 还有血量的话，继续下一波
                    if(cc.battleScene.crystal.decBlood()){
                        cc.battleScene.monster_wave.startNextWave();
                    }
                }
            }
        }
    },
    initMonster(monsterCfg){
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
    startMove(roadCfg){
        this.node.active = true;
        this.roadCfg = roadCfg;
        this.stopMove = false;
        this.nextRoadId = 0;
        this.node.x = (this.roadCfg[this.nextRoadId].posX - 6) * 64;
        this.node.y = (this.roadCfg[this.nextRoadId].posY - 3) * 64;
        this.nextRoadId ++;
    },
    onDeath(){
        this.roadCfg = null;
        cc.battleScene.onMonsterDeath();
        this.node.removeFromParent();
    },
    onAttected(weaponCfg){
        this.hpNode.active = true;
        var att = checkNum(weaponCfg.att);
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
    getNextPos(){
        return cc.v2((this.roadCfg[this.nextRoadId].posX - 6) * 64, (this.roadCfg[this.nextRoadId].posY - 3) * 64);
    },

});
