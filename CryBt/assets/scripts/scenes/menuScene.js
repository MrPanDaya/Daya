
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
        cc.menuScene = this;

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
    start () {},
    // update (dt) {},

    onScorllEvent(){
        this.selMapTips.active = false;
    },
});
