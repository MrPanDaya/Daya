
cc.Class({
    extends: cc.Component,
    properties: {
        empty_node: cc.Node,
        sel_node: cc.Node,
        weapon_node: cc.Node,
        weapon: cc.Sprite
    },
    // onLoad () {},
    // start () {},
    // update (dt) {},

    initWeaponGrid(){
        // cc.battleScene.weapon_node;
        // cc.battleScene.buttle_node;
        this.empty_node.active = false;
        this.weaponId = 0;
        this.onWeaponGridUnSel();
    },

    onWeaponGirdSel(){
        cc.battleScene.onWeaponGridSelected(this);
        this.selected = true;
        if(!this.weaponId){
            this.empty_node.active = false;
            this.weapon_node.active = false;
            this.sel_node.active = true;
            this.sel_node.getComponent(cc.Animation).play("grid_state", 0);
        }else {

        }

        // this.buildWeapon(1012 + Math.floor(Math.random()*7) * 10)
    },

    onWeaponGridUnSel(){
        this.selected = false;
        if(!this.weaponId){
            this.sel_node.active = false;
            this.weapon_node.active = false;
            if(!this.empty_node.active){
                this.empty_node.active = true;
                this.empty_node.getComponent(cc.Animation).play("weaponEmpty", 0);
            }
        }else{

        }
    },

    buildWeapon(weaponId){
        console.log("build weapon:" + weaponId);
        this.weaponId = weaponId;
        this.weaponCfg = weaponCfgList[weaponId+""];
        var self = this;
        cc.loader.loadRes("battleImg/" + this.weaponCfg.assertName, cc.SpriteFrame, function (err, spriteFrame) {
            self.weapon.spriteFrame = spriteFrame;
        });
        cc.loader.loadRes("battleImg/" + this.weaponCfg.backPic, cc.SpriteFrame, function (err, spriteFrame) {
            self.weapon_node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            self.weapon_node.active = true;
            self.sel_node.active = false;
            self.empty_node.active = false;
        });
    },
});
