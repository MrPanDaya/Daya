
cc.Class({
    extends: cc.Component,

    properties: {
        lb: cc.Label
    },

    setTips: function(sTips, color){
        this.lb.string = sTips;
        this.lb.node.color = color;
        this.node.position = cc.v2(0, 300);
        var delay = cc.delayTime(0.5);
        var move = cc.moveTo(0.5, cc.v2(0, 500));
        var fat = cc.fadeTo(0.5, 64);
        var call = cc.callFunc(function(){
            this.node.removeFromParent(true);
        }.bind(this))
        this.node.runAction(cc.sequence(delay, move, fat, call));
    },
});
