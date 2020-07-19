cc.Class({
    extends: cc.Component,

    properties: {
        road_node: cc.Node,
        bag_sprite: cc.Sprite,
        road_grid: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.initScene(1000)
    },

    start () {

    },

    initScene(sceneId){
        // 背景图片
        var self = this;
        cc.loader.loadRes("bg/Back"+sceneId, cc.SpriteFrame, function (err, spriteFrame) {
            self.bag_sprite.spriteFrame = spriteFrame;
        });
        // 道路
        this.initRoad(sceneId);
    },

    initRoad(sceneId){
        var roadCfg = mapCfg[sceneId].roadGrid;
        for(var k in roadCfg){
            var gridCfg = roadCfg[k];
            var grid = cc.instantiate(this.road_grid);
            this.road_node.addChild(grid);
            grid.getComponent("road_grid").initGrid(gridCfg.img);
            grid.x = (gridCfg.posX - 6) * 64;
            grid.y = (gridCfg.posY - 3) * 64;
        }
    },

    // update (dt) {},
});
