
cc.Class({
    extends: cc.Component,
    properties: {
        selMapBgNode1: cc.Node,
        selMapBgNode2: cc.Node,
        selMapBgNode3: cc.Node,

        selMapBtnPrefab: cc.Prefab,
        selMapTipsPrefab: cc.Prefab,
    },
    onLoad () {
        initLocalData();
        cc.menuScene = this;

        this.sel_cry_node = this.node.getChildByName("sel_cry_node");
        this.sel_map_node = this.node.getChildByName("sel_map_node");
        this.tips_ui = this.node.getChildByName("tips_node").getComponent("tips_ui");

        this.selMapTips = cc.instantiate(this.selMapTipsPrefab);
        this.node.addChild(this.selMapTips);
        this.selMapTips.active = false;

        for(var i = 0; i < 10; i++){
            var selBtn1 = cc.instantiate(this.selMapBtnPrefab);
            this.selMapBgNode1.addChild(selBtn1);
            selBtn1.x = 90 + i * 125;
            selBtn1.y = -260 + i * 15;
            selBtn1.getComponent("selMapBtn").initSelMapBtn(1000 + i);

            var selBtn2 = cc.instantiate(this.selMapBtnPrefab);
            this.selMapBgNode2.addChild(selBtn2);
            selBtn2.x = 80 + i * 125;
            selBtn2.y = -100 - (i % 2) * 50;
            selBtn2.getComponent("selMapBtn").initSelMapBtn(2000 + i);

            var selBtn3 = cc.instantiate(this.selMapBtnPrefab);
            this.selMapBgNode3.addChild(selBtn3);
            selBtn3.x = 70 + i * 125;
            selBtn3.y = -110 - i * 15;
            selBtn3.getComponent("selMapBtn").initSelMapBtn(3000 + i);
        }
    },
    start () {
        cc.audioEngine.playMusic("menu3")
    },
    update (dt) {
        cc.audioEngine.updateEffect();
    },

    onScorllEvent(){
        this.selMapTips.active = false;
    },

    onBtnBackToSelCry(){
        cc.audioEngine.playEffect("btn")
        this.sel_cry_node.active = true;
        this.sel_map_node.active = false;
    },

    onBtnEnterSelMap(){
        cc.audioEngine.playEffect("btn")
        this.sel_cry_node.active = false;
        this.sel_map_node.active = true;
    },

    showTips(tips){
        this.tips_ui.showTips(tips);
    },
});
