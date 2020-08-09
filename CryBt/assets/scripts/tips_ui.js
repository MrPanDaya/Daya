cc.Class({
    extends: cc.Component,

    properties: {

    },
    onLoad(){
       this.tipsTimer = 0;
       this.totalTimer = 1.2;
    },

    update(dt){
        if(this.node.active === true){
            this.tipsTimer += dt;
            this.node.opacity = 255 * Math.max(this.totalTimer - this.tipsTimer, 0) / this.tipsTimer;
            if(this.tipsTimer >= this.totalTimer){
                this.tipsTimer = 0;
                this.node.active = false;
            }
        }
    },

    showTips(tips){
        this.tipsTimer = 0;
        this.node.active = true;
        this.node.opacity = 255;
        this.getComponent(cc.Label).string = tips;
    },

});
