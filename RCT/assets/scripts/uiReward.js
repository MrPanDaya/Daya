cc.Class({
    extends: cc.Component,

    properties: {
        coinPrefab: cc.Prefab,
    },
    onLoad(){
        this.coinList = [];
    },
    showReward(coinNum, targPos){
        var stepNum = 100;
        var count = coinNum / stepNum;
        var pos = this.node.position;
        for(var i = 0; i < count; i++){
            if(i > this.coinList.length - 1){
                var coinNode = cc.instantiate(this.coinPrefab);
                this.node.addChild(coinNode);
                var uiCoin = coinNode.getComponent("rwCoin");
                this.coinList.push(uiCoin);
            }
            var rwCoin = this.coinList[i];
            rwCoin.node.active = true;
            rwCoin.node.position = pos;
            rwCoin.setReward(stepNum, targPos, i);
        }
    },
});
