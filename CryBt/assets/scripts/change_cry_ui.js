cc.Class({
    extends: cc.Component,

    properties: {
        labLv : cc.Label,
        labExp: cc.Label,
        expBar: cc.Node,

        labBtnSel: cc.Label,
        btnLvUp: cc.Node,

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
    start(){
        this.crystalPage.setCurrentPageIndex(LocalData.selCrystalId);
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
    onProgressChange(percent){
        percent = Math.min(percent, 1);
        this.expBar.x = this.expBar.width * percent;
    },
    resetCrystalData(){
        var userCryData = getCrystalData(this.selIndex);
        // 解锁状态
        if (userCryData.unlock === 1) {
            this.btnLvUp.active = true;
            this.labBtnSel.string = "选择水晶";
            this.labBtnSel.node.color = new cc.Color(255, 255, 255, 255);
        } else {
            this.btnLvUp.active = false;
            this.labBtnSel.string = "解锁水晶";
            this.labBtnSel.node.color = new cc.Color(255, 0, 0, 255);
        }
        if(userCryData){
            this.labLv.string = userCryData.lv;
            var attData = getCrystalAtt(this.selIndex, userCryData.lv);
            var attDataNext = getCrystalAtt(this.selIndex, userCryData.lv + 1);
            this.labAtt.string = Math.floor(attData.att * 100) + "%";

            if(isCrystalMaxLv(this.selIndex, userCryData.lv)){
                this.onProgressChange(1);
                this.labExp.string = "MAX";
            }else{
                var percent = userCryData.curExp / attDataNext.exp;
                this.onProgressChange(percent);
                this.labExp.string = userCryData.curExp + " / " + attDataNext.exp;
            }
        }
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
        this.resetCrystalData();
    },
    onBtnSelect(){
        var userCryData = getCrystalData(this.selIndex);
        if (userCryData.unlock === 1) {
            LocalData.selCrystalId = this.selIndex;
            saveLocalData();
        }else {
            if(this.selIndex === 1 || this.selIndex === 2){
                cc.menuScene.showTips("请通关副本获得!");
                cc.menuScene.onBtnEnterSelMap();
            }else{
                cc.menuScene.showTips("请到星际看看吧!");
            }
        }
        this.onBtnClose();
    },
    onBtnLvUp(){
        var userCryData = getCrystalData(this.selIndex);
        if(isCrystalMaxLv(this.selIndex, userCryData.lv)){
            cc.menuScene.showTips("已是最高级!");
            return;
        }
        this.lvupCryNode.getComponent("lvup_cry_ui").initLvupUi(this.selIndex);
        this.lvupCryNode.active = true;
    },
});
