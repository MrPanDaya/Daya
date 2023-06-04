/*
* 描述：游戏结算界面类
* */
cc.Class({
    extends: cc.Component,

    // LIFE-CYCLE CALLBACKS:
    /*
    * 描述：结算界面初始化
    * */
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
        if(!this.btnRevive){
            this.btnRevive = this.node.getChildByName("btn_revive");
        }
    },
    // start () {},
    /*
    * 描述：刷新结算界面
    * */
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
            this.curMoney += Math.max(Math.floor(dt*this.totalMoney), 1);
            if(this.curMoney >= this.totalMoney){
                this.curMoney = this.totalMoney;
                this.startMoneyAni = false;
            }
            this.moneyLab.string = this.curMoney;
        }
    },

    /*
    * 描述：设置结算界面的显示或隐藏
    * */
    setVisible(bVisible){
        this.node.active = bVisible;
        if(bVisible){
            this.runScoreNodeAction();
            this.runMoneyNodeAction();
            this.runBestNodeAction();
        }
    },

    setReward(money){
        this.totalMoney = money;
    },

    /*
    * 描述：继续游戏按钮的回调
    * */
    onBtnContinue(){
        window.audioMgr.playSound(cc.soundId.btn);
        if(cc.mainScene) cc.mainScene.onBtnStartGame();
        this.node.active = false;
        // 加上金币
        cc.LocalData.totalMoney += this.totalMoney;
        this.totalMoney = 0;
        saveLocalData();
    },

    // 复活
    onBtnRevive(){
        window.audioMgr.playSound(cc.soundId.btn);
        var self = this;
        showAD( function (isEnable, err) {
            if(isEnable){
                if(cc.mainScene) cc.mainScene.onRevive();
                self.node.active = false;
                console.log("show ad success !!");
            }else{
                uiHelper.showTips("激励视频 广告显示失败", cc.color(255,0,0, 255));
                if(err) console.error("showAD err ", err);
            }
        })
    },

    /*
    * 描述：推出游戏按钮的回调
    * */
    onBtnExitGame(){
        // 加上金币
        cc.LocalData.totalMoney += this.totalMoney;
        this.totalMoney = 0;
        saveLocalData();

        var self = this
        cc.director.preloadScene("selRoleScene", function () {
            window.audioMgr.playSound(cc.soundId.btn);
            if (self.node)  self.node.active = false;
            if(cc.mainPlayer) cc.mainPlayer.startPlay = false;
            cc.director.loadScene("selRoleScene");
        });
    },

    /*
    * 描述：播放结算分数的动画
    * */
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

    /*
    * 描述：播放金币的动画
    * */
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

    /*
    * 描述：播放最高分数的动画
    * */
    runBestNodeAction(){
        this.btnContinue.active = false;
        this.btnExit.active = false;
        this.btnRevive.active = false;
        this.bestLab.string = Math.floor(cc.mainScene.maxScore);
        this.bestNode.x = this.node.width;
        var delay = cc.delayTime(1);
        var move = cc.moveTo(0.2, cc.v2(0, this.bestNode.y));
        var delay1 = cc.delayTime(0.2);
        var endCall = cc.callFunc(function(){
            this.btnContinue.active = true;
            this.btnExit.active = true;
            this.btnRevive.active = cc.mainScene.reviveCount > 0;
            cc.director.getPhysicsManager().enabled = false;
        }.bind(this))
        this.bestNode.runAction(cc.sequence(delay, move, delay1, endCall));
    },

});
