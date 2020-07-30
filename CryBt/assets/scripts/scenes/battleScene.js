cc.Class({
    extends: cc.Component,

    properties: {
        bag_sprite: cc.Sprite,
        road_grid: cc.Prefab,
        weapon_grid: cc.Prefab,
        born_effect: cc.Prefab,
        weapon_choose: cc.Prefab,
    },

    onLoad () {
        cc.battleScene = this;
        this.road_node = this.node.getChildByName("road_node");
        this.monster_node = this.node.getChildByName("monster_node");
        this.buttle_node = this.node.getChildByName("buttle_node");
        this.weapon_node = this.node.getChildByName("weapon_node");
        this.monster_born_node = this.node.getChildByName("monster_born_node");
        this.weapon_tips = this.node.getChildByName("weapon_tips");
        this.weapon_lvup = this.node.getChildByName("weapon_lvup").getComponent("lvup_weapon");
        this.initUserData();
        this.initScene(1000);
    },

    initUserData(){
        this.data = {
            money: 500,
        }
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
        // 可使用的武器列表
        this.initBuildWeaponList();
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
        this.weaponGirdList = [];
        for(var k in weaponGridCfg){
            var gridPos = weaponGridCfg[k];
            var weaponGrid = cc.instantiate(this.weapon_grid);
            this.weapon_node.addChild(weaponGrid);
            weaponGrid.x = (gridPos.posX - 6) * 64;
            weaponGrid.y = (gridPos.posY - 3) * 64;
            var grid = weaponGrid.getComponent("weapon_grid");
            grid.initWeaponGrid();
            this.weaponGirdList.push(grid);
        }
    },

    initBuildWeaponList(){
        for(var i = 0, len = this.mapConfig.weapon.length; i < len; ++i){
            var weaponId = this.mapConfig.weapon[i];
            var weaponCfg = weaponCfgList[weaponId];
            if(weaponCfg){
                var chooseWeapon = cc.instantiate(this.weapon_choose);
                this.weapon_tips.addChild(chooseWeapon);
                chooseWeapon.getComponent("choose_weapon").initWeapon(i, weaponCfg);
            }
        }
    },

    onWeaponGridSelected(grid){
        for(var i = 0, len = this.weaponGirdList.length; i < len; ++i){
            if(this.weaponGirdList[i] != grid){
                this.weaponGirdList[i].onWeaponGridUnSel();
            }
        }
    },

    onUnSelect(){
        this.hideWeaponTips();
        this.weapon_lvup.node.active = false;
        if(this.selWeaponGrid){
            this.selWeaponGrid.onWeaponGridUnSel();
            this.selWeaponGrid = null;
        }
    },

    showWeaponTips(weaponGrid){
        this.selWeaponGrid = weaponGrid;
        this.weapon_tips.active = true;
        this.weapon_tips.x = weaponGrid.node.x + 64;
        this.weapon_tips.y = weaponGrid.node.y;
        this.weapon_lvup.node.active = false;
    },

    hideWeaponTips(){
        this.weapon_tips.active = false;
    },

    buildWeapon(weaponId){
        if(this.selWeaponGrid){
            this.selWeaponGrid.buildWeapon(weaponId);
        }
    },

    showLvupWeaponNode(weaponGrid){
        this.selWeaponGrid = weaponGrid;
        this.weapon_lvup.showLvupWeapon(this.selWeaponGrid);
        this.hideWeaponTips();
    },

});
