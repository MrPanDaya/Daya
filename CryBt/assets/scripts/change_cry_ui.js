cc.Class({
    extends: cc.Component,

    properties: {
        labLv : cc.Label,
        expBar: cc.Node,

        cryName: cc.Sprite,
        cryText: cc.Sprite,
        labAtt: cc.Label,

        leftPic: cc.Node,
        rightPic: cc.Node,

        crystalNode: cc.Node,
        lvupCryNode: cc.Node,
    },
    onLoad () {
        this.btnTimer = 0;
    },
    update (dt) {
        this.updateBtnLR(dt);
    },

    updateBtnLR(dt){
        this.btnTimer += dt;
        if(this.btnTimer >= 2){
            this.btnTimer = 0;
        }
        var op = 255 * this.btnTimer / 2;
        this.leftPic.opacity = op;
        this.rightPic.opacity = op;
    },

    onBtnClose(){
        this.node.active = false;
    },
    onBtnLeft(){

    },
    onBtnRight(){

    },
    onBtnSelect(){
        this.lvupCryNode.active = true;
    },
});
