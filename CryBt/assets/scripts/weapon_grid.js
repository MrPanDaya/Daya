
cc.Class({
    extends: cc.Component,
    properties: {
        grid_state: cc.Node,
    },
    // onLoad () {},
    start () {},
    // update (dt) {},

    initWeaponGrid(){
        // cc.battleScene.weapon_node;
        // cc.battleScene.buttle_node;
        this.grid_state.getComponent(cc.Animation).play("grid_state", 0);
    },

    onWeaponGirdSel(){
        console.log("=============")
    }
});
