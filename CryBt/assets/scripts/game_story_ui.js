cc.Class({
    extends: cc.Component,

    properties: {
        storyNode0: cc.Node,
        storyNode1: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:
    // onLoad () {},
    start () {
        this.dlTime = 0
        this.storyId = 0;
        this.endStory = false
        for (var i = 0; i < this.storyNode0.childrenCount; i++){
            this.storyNode0.children[i].opacity = 0;
        }
        for (var i = 0; i < this.storyNode1.childrenCount; i++){
            this.storyNode1.children[i].opacity = 0;
        }
        this.storyNode0.active = true;
        this.storyNode1.active = false;
    },

    update (dt) {
        if(this.endStory) return
        this.dlTime += dt;
        if(this.dlTime < 1.5) return
        this.dlTime = 0
        if(this.storyId >= this.storyNode0.childrenCount){
            this.storyNode0.active = false;
            this.storyNode1.active = true;
            var id = this.storyId - this.storyNode1.childrenCount
            if (id >= this.storyNode1.childrenCount) {
                this.endStory = true
                return
            }
            this.storyNode1.children[id].runAction(cc.fadeIn(1))
        }else{
            this.storyNode0.children[this.storyId].runAction(cc.fadeIn(1))
        }
        this.storyId ++
    },
});
