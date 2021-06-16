
cc.Class({
    extends: cc.Component,

    properties: {
        loadingNode: cc.Node,
    },

    onLoad () {
        cc.audioEngine.start();
        cc.audioEngine.setHoldingEffects([
            "btn", "btn2"
        ]);
        this.loading_ui = this.loadingNode.getComponent("loading_ui");
        this.loading_ui.reset()
    },
    start () {
        cc.audioEngine.playMusic("menu0")
    },
    update (dt) {
        cc.audioEngine.updateEffect();
    },

    onBtnStartGame(){
        cc.audioEngine.playEffect("btn")
        this.loadingNode.active = true
        var self = this
        cc.director.preloadScene("MenuScene", function (completedCount, totalCount) {
            self.updateLoadProgress(completedCount, totalCount)
        },function () {
            cc.director.loadScene("MenuScene");
            self.loading_ui.reset()
        });
    },
    updateLoadProgress(count, totalCount){
        this.loading_ui.updateProgress(count, totalCount)
    },
});
