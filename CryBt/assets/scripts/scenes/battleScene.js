cc.Class({
    extends: cc.Component,

    properties: {
        bag_sprite: cc.Sprite,
        road_grid: cc.Prefab,
        weapon_grid: cc.Prefab,
        born_effect: cc.Prefab,
    },

    onLoad () {
        cc.battleScene = this;
        this.road_node = this.node.getChildByName("road_node");
        this.monster_node = this.node.getChildByName("monster_node");
        this.buttle_node = this.node.getChildByName("buttle_node");
        this.weapon_node = this.node.getChildByName("weapon_node");
        this.monster_born_node = this.node.getChildByName("monster_born_node");
        this.initScene(1000)
    },

    // start () { },
    // update (dt) {},

    initScene(sceneId){
        // 背景图片
        var self = this;
        cc.loader.loadRes("bg/Back"+sceneId, cc.SpriteFrame, function (err, spriteFrame) {
            self.bag_sprite.spriteFrame = spriteFrame;
        });
        // 地图配置
        this.mapConfig = mapCfg[sceneId];
        // 道路
        this.initRoad();
        // 武器格子
        this.initWeaponGrid();
    },

    initRoad(){
        var roadCfg = this.mapConfig.roadGrid;
        for(var k in roadCfg){
            var gridCfg = roadCfg[k];
            var grid = cc.instantiate(this.road_grid);
            this.road_node.addChild(grid);
            grid.getComponent("road_grid").initGrid(gridCfg.img);
            grid.x = (gridCfg.posX - 6) * 64;
            grid.y = (gridCfg.posY - 3) * 64;
        }
        // 怪物出生点
        var startGridCfg = roadCfg[0];
        if(!this.bornEffect){
            this.bornEffect = cc.instantiate(this.born_effect);
            this.monster_born_node.addChild(this.bornEffect);
        }
        this.bornEffect.x = (startGridCfg.posX - 6) * 64;
        this.bornEffect.y = (startGridCfg.posY - 3) * 64;
        this.bornEffect.getComponent(cc.Animation).play("monsterBornPos", 0);
    },

    initWeaponGrid(){
        var weaponGridCfg = this.mapConfig.weaponGrid;
        for(var k in weaponGridCfg){
            var gridPos = weaponGridCfg[k];
            var weaponGrid = cc.instantiate(this.weapon_grid);
            this.weapon_node.addChild(weaponGrid);
            weaponGrid.x = (gridPos.posX - 6) * 64;
            weaponGrid.y = (gridPos.posY - 3) * 64;
            weaponGrid.getComponent("weapon_grid").initWeaponGrid();
        }
    }

});
