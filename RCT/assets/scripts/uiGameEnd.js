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
    // onLoad () {},
    // start () {},
    // update (dt) {},
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
        cc.director.preloadScene("loginScene", function () {
            cc.audioMgr.playSound(cc.soundId.btn);
            if (self.node)  self.node.active = false;
            cc.director.loadScene("loginScene");
        });
    },

    runScoreNodeAction(){
        if(!this.scoreNode){
            this.scoreNode = this.node.getChildByName("score_node");
        }
        this.scoreNode.x = this.node.width;
        var delay = cc.delayTime(0);
        var move = cc.moveTo(0.2, cc.p(0, this.scoreNode.y));
        this.scoreNode.runAction(cc.sequence(delay, move));
    },

    runMoneyNodeAction(){
        if(!this.moneyNode){
            this.moneyNode = this.node.getChildByName("money_node");
        }
        this.moneyNode.x = this.node.width;
        var delay = cc.delayTime(0.3);
        var move = cc.moveTo(0.2, cc.p(0, this.moneyNode.y));
        this.moneyNode.runAction(cc.sequence(delay, move));
    },

    runBestNodeAction(){
        if(!this.bestNode){
            this.bestNode = this.node.getChildByName("best_node");
        }
        this.bestNode.x = this.node.width;
        var delay = cc.delayTime(0.6);
        var move = cc.moveTo(0.2, cc.p(0, this.bestNode.y));
        this.bestNode.runAction(cc.sequence(delay, move));
    },

});
