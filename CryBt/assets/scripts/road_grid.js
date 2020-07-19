cc.Class({
    extends: cc.Component,

    properties: {
        road_img : cc.Sprite
    },

    initGrid(imgName){
        var self = this;
        this.road_img.node.active = false;
        cc.loader.loadRes("battleImg/"+imgName, cc.SpriteFrame, function (err, spriteFrame) {
            self.road_img.spriteFrame = spriteFrame;
            self.road_img.node.active = true;
        });
    }
});
