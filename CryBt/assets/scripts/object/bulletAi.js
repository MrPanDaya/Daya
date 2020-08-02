cc.Class({
    extends: cc.Component,

    properties: {
    },
    onLoad(){

    },
    update (dt) {
        if(this.flowMonster && this.node.active){
            var monsterPos = cc.v2(this.flowMonster.node.x, this.flowMonster.node.y);
            var pos = cc.v2(this.node.x, this.node.y);
            var dir = monsterPos.sub(pos);
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
                this.flowMonster.onAttected(this.weaponCfg);
                cc.battleScene.backBullet(this.node);
            }
        }
    },

    initButtle(weapon, flowMonster){
        this.flowMonster = flowMonster;
        this.weaponCfg = weapon.weaponCfg;
        this.speed = checkNum(this.weaponCfg.buttleSpeed);
        this.addSpeed = checkNum(this.weaponCfg.buttleAccSpeed);
        this.hitRadius = checkNum(this.weaponCfg.buttleRadius);
        this.sound = this.weaponCfg.sound;

        this.node.x = weapon.node.x;
        this.node.y = weapon.node.y;
        this.node.angle = weapon.weapon.node.angle;
        this.node.getComponent(cc.Sprite).spriteFrame = weapon.buttlePic;
        this.node.active = true;
    },


});
