// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        if(!this.scoreNode){
            this.scoreNode = this.node.getChildByName("score_node");
            this.scoreLab =this.scoreNode.getChildByName("score_text").getComponent(cc.Label);
        }
        if(!this.moneyNode){
            this.moneyNode = this.node.getChildByName("money_node");
            this.moneyLab =this.moneyNode.getChildByName("money_text").getComponent(cc.Label);
        }
        if(!this.bestNode){
            this.bestNode = this.node.getChildByName("best_node");
            this.bestLab =this.bestNode.getChildByName("best_text").getComponent(cc.Label);
        }
        if(!this.btnContinue){
            this.btnContinue = this.node.getChildByName("btn_continue");
        }
        if(!this.btnExit){
            this.btnExit = this.node.getChildByName("btn_exit");
        }
    },
    // start () {},
    update (dt) {
        if(this.startScoreAni){
            var totalScore = Math.floor(cc.mainScene.score);
            this.curScore += Math.max(Math.floor(dt*totalScore), 1);
            if(this.curScore >= totalScore){
                this.curScore = totalScore;
                this.startScoreAni = false;
            }
            this.scoreLab.string = this.curScore;
        }
        if(this.startMoneyAni){
            var totalMoney = Math.floor(cc.mainScene.addMoney);
            this.curMoney += Math.max(Math.floor(dt*totalMoney), 1);
            if(this.curMoney >= totalMoney){
                this.curMoney = totalMoney;
                this.startMoneyAni = false;
            }
            this.moneyLab.string = this.curMoney;
        }
    },

    setVisible(bVisible){
        this.node.active = bVisible;
        if(bVisible){
            this.runScoreNodeAction();
            this.runMoneyNodeAction();
            this.runBestNodeAction();
        }
    },

    onBtnContinue(){
        cc.audioMgr.playSound(cc.soundId.btn);
        if(cc.mainScene) cc.mainScene.onBtnStartGame();
        this.node.active = false;
    },

    onBtnExitGame(){
        var self = this
        cc.director.preloadScene("selRoleScene", function () {
            cc.audioMgr.playSound(cc.soundId.btn);
            if (self.node)  self.node.active = false;
            cc.director.loadScene("selRoleScene");
        });
    },

    runScoreNodeAction(){
        this.curScore = 0;
        this.scoreNode.x = this.node.width;
        this.startScoreAni = false;
        var delay = cc.delayTime(0);
        var move = cc.moveTo(0.2, cc.v2(0, this.scoreNode.y));
        var endCall = cc.callFunc(function(){
            this.startScoreAni = true;
        }.bind(this))
        this.scoreNode.runAction(cc.sequence(delay, move, endCall));
    },

    runMoneyNodeAction(){
        this.curMoney = 0;
        this.moneyNode.x = this.node.width;
        this.startMoneyAni = false;
        var delay = cc.delayTime(0.3);
        var move = cc.moveTo(0.2, cc.v2(0, this.moneyNode.y));
        var endCall = cc.callFunc(function(){
            this.startMoneyAni = true;
        }.bind(this))
        this.moneyNode.runAction(cc.sequence(delay, move, endCall));
    },

    runBestNodeAction(){
        this.btnContinue.active = false;
        this.btnExit.active = false;
        this.bestLab.string = Math.floor(cc.mainScene.maxScore);
        this.bestNode.x = this.node.width;
        var delay = cc.delayTime(1);
        var move = cc.moveTo(0.2, cc.v2(0, this.bestNode.y));
        var delay1 = cc.delayTime(0.2);
        var endCall = cc.callFunc(function(){
            this.btnContinue.active = true;
            this.btnExit.active = true;
            cc.director.getPhysicsManager().enabled = false;
        }.bind(this))
        this.bestNode.runAction(cc.sequence(delay, move, delay1, endCall));
    },

});
