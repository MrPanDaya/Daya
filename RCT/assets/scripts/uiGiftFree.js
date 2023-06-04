
cc.Class({
    extends: cc.Component,

    properties: {
        labReward: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if(cc.LocalData.lbAdCount === undefined)
            cc.LocalData.lbAdCount = 0;
        this.labReward.string = cc.LocalData.lbAdCount * 100;
    },

    start () {

    },

    onBtnShare(){
        window.audioMgr.playSound(cc.soundId.btn);
        var args = {};
        args.title = "我突然想起小时候的黑白掌机";
        args.desc = "常常想起小时候的黑白掌机里面的赛车，于是决定自己做一个！哈~";
        shareByMiniGame(args);
        this.onBtnClose();
    },

    onBtnShowAD(){
        window.audioMgr.playSound(cc.soundId.btn);
        var self = this;
        showAD(function (isEnable, err) {
            if(isEnable){
                if(cc.mainScene)
                    cc.mainScene.showReward(500 + cc.LocalData.lbAdCount * 100);
                else if(cc.selRoleScene)
                    cc.selRoleScene.showReward(500 + cc.LocalData.lbAdCount * 100);
                cc.LocalData.lbAdCount ++;
                console.log("success !!");
            }else{
                uiHelper.showTips("激励视频 广告显示失败", cc.color(255,0,0, 255));
                if(err) console.error("showAD err ", err);
            }
        })
        self.onBtnClose();
    },

    onBtnClose(){
        window.audioMgr.playSound(cc.soundId.btn);
        this.node.removeFromParent();
    },
});
