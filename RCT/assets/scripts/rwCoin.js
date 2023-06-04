cc.Class({
    extends: cc.Component,

    properties: {
        txt : cc.Label
    },
    setReward(coinNum, tagPos, id){
        this.txt.string = coinNum;

        var p = cc.v2(this.node.position.x + Math.floor(Math.random()*(100) - 50), this.node.position.y + Math.floor(Math.random()*(100) - 50));
        var move1 = cc.moveTo(0.2, p);
        var move = cc.moveTo(0.5, tagPos);
        var dl = cc.delayTime(0.2 + id * 0.1);
        var self = this;
        var callfun = cc.callFunc(function(){
            self.node.active = false;
            cc.LocalData.totalMoney += coinNum;
            if(cc.selRoleScene)
                cc.selRoleScene.onTotalMoneyChanged();
        });
        this.node.runAction(cc.sequence(move1, dl, move, callfun))
    },

});
