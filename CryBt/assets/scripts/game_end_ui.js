
cc.Class({
    extends: cc.Component,

    properties: {
        labExp: cc.Label,
        labCry: cc.Label,
        labExpExt: cc.Label,
        labCryExt: cc.Label,

        winPic: cc.Node,
        losePic: cc.Node,
        btnRestart: cc.Node,
        btnNextMap: cc.Node,

        starList: [cc.Node],
        starBgList: [cc.Node],
    },

    initGameEndUi(){
        if(this.node.active) return;
        this.node.active = true;
        var cryHp = cc.battleScene.crystal.crystalHp;
        // 三星相关
        var starNum = this.celStar(cryHp);
        if(starNum > 0){
            setUnlockMapId(cc.curSelMapId);
            setMapStarNum(cc.curSelMapId, starNum);
        }
        for(var i = 0; i < this.starList.length; ++i){
            this.starList[i].active = (i < starNum);
            this.starBgList[i].active = (i >= starNum);
        }
        // 胜利/失败
        this.winPic.active = (cryHp > 0);
        this.btnNextMap.active = (cryHp > 0);
        this.losePic.active = (cryHp <= 0);
        this.btnRestart.active = (cryHp <= 0);

        // 计算奖励
        if(cryHp > 0){
            var reward = getGameEndReward(cc.curSelMapId, starNum);
            console.log("reward:", reward);
            this.labExp.string = reward.exp;
            this.labCry.string = reward.cry;
            this.labExpExt.string = reward.starExp;
            this.labCryExt.string = reward.starCry;
            // 保存
            LocalData.baseCryCount += (reward.cry + reward.starCry);
            LocalData.baseExp += (reward.exp + reward.starExp);
        }
    },

    celStar(hp){
        var star = 0;
        if(hp > 0 && hp <= 2){
            star = 1;
        }else if(hp > 2 && hp <= 4){
            star = 2;
        }else if(hp >= 5){
            star = 3;
        }
        return star;
    },

    onBtnRestart(){
        this.node.active = false;
        cc.battleScene.onGameRestart();
    },

    onBtnSelMap(){
        this.node.active = false;
        cc.battleScene.onBackMenuScene();
    },

    onBtnNextMap(){
        var mapIndex = 0;
        for(var k in mapCfg){
            mapIndex ++;
            if(k == cc.curSelMapId){
                break;
            }
        }
        var keyList = Object.keys(mapCfg);
        if(mapIndex >= keyList.length){
            cc.battleScene.showTips("已经是最后一关了！");
            this.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function () {
                this.onBtnSelMap();
            }.bind(this))));
            return;
        }
        cc.curSelMapId = keyList[mapIndex];
        this.node.active = false;
        cc.battleScene.onGameRestart();
    },

});
