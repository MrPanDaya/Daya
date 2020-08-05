cc.Class({
    extends: cc.Component,

    properties: {
        lockPicNode: cc.Node,
        starNodeList: [cc.Node],
        btnSelMap: cc.Button,
    },

    initSelMapBtn(mapId){
        this.selMapId = mapId;
        this.unLock = false;
        for(var i = 0; i < this.starNodeList.length; ++i){
            this.starNodeList[i].active = false;
        }
        this.btnSelMap.zoomScale = this.unLock ? 1.2 : 1;
    },

    onBtnSelMap(e){
        console.log(this.selMapId);
        var selMapTips = cc.menuScene.selMapTips;
        selMapTips.getComponent("selMapTips").initSelMap(this.selMapId);
        var worldPos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
        var pos = selMapTips.getParent().convertToNodeSpaceAR(worldPos);
        if(pos.x + selMapTips.width > cc.winSize.width/2)
            pos.x -= selMapTips.width;
        selMapTips.x = pos.x ;
        selMapTips.y = pos.y + 30;
    },
});
