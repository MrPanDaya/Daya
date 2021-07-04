// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        gridPrefab: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.grid_node = this.node.getChildByName("grid_node");
        this.gridList = []
        for (var i = 0; i < 7; i ++){
            for (var j = 0; j < 13; j ++){
                var grid = cc.instantiate(this.gridPrefab);
                this.grid_node.addChild(grid);
                grid.x = (j - 6) * 64;
                grid.y = (i - 3) * 64;
                // var weaponAi = weapon.getComponent("weaponAi");
                this.gridList.push(grid);
            }
        }
    },

    start () {

    },

    // update (dt) {},
});
