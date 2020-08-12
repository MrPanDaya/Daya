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

        lvupCryNode: cc.Node,
        crystalPage: cc.PageView,

        crystalPrefab: cc.Prefab,
    },
    onLoad () {
        this.btnTimer = 0;
        for(var i = 0; i < 5; ++i){
            var cry = cc.instantiate(this.crystalPrefab);
            cry.getComponent("crystalShow").initCrystalShow(i);
            this.crystalPage.content.addChild(cry);
        }
        this.onPageChange();
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
    onBtnLeft() {
        if (this.selIndex > 0) {
            this.crystalPage.scrollToPage(this.selIndex - 1, 0.5);
        }
    },
    onBtnRight() {
        if (this.selIndex < 4) {
            this.crystalPage.scrollToPage(this.selIndex + 1, 0.5);
        }
    },
    onPageChange() {
        this.selIndex = this.crystalPage.getCurrentPageIndex();
        var self = this;
        cc.loader.loadRes("menuImg/crystalName" + this.selIndex, cc.SpriteFrame, function (err, spriteFrame) {
            self.cryName.spriteFrame = spriteFrame;
        });
        cc.loader.loadRes("menuImg/crystalText" + this.selIndex, cc.SpriteFrame, function (err, spriteFrame) {
            self.cryText.spriteFrame = spriteFrame;
        });
    },
    onBtnSelect(){
        this.lvupCryNode.getComponent("lvup_cry_ui").initLvupUi(this.selIndex);
        this.lvupCryNode.active = true;
    },
});
