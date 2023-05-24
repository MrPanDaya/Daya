/*
* 描述：封装的本地数据存储的接口
* */
(function () {
    window.uiHelper = {
        initHelper: function(){
            var self = this;
            cc.loader.loadRes("prefabs/tips_node", cc.Prefab, function (error, prefab) {
                if (error) {
                    cc.error(error);
                    return;
                }
                self.tipsPrefab = prefab;
            });
        },
        /*
        * 描述：吐司
        * */
        showTips: function (sTips, color) {
            if(this.tipsPrefab){
                var tipsNode = cc.instantiate(this.tipsPrefab);
                tipsNode.parent = cc.find("Canvas");
                var uiTips = tipsNode.getComponent("uiTips");
                uiTips.setTips(sTips, color);
            }
        },

    }
})();

