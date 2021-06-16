// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        progressBar: cc.Node,
    },
    reset(){
        this.progressBar.x = 0
        this.node.active = false
    },
    updateProgress(count, totalCount){
        if (totalCount === 0) {
            return
        }
        this.progressBar.x = this.progressBar.width * count / totalCount
    }
});
