// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        btnLvup: cc.Button,
        lvupText: cc.Label,
        dropText: cc.Label,
    },

    onLoad(){
        this.sWidth = this.node.width;
        this.sHeight = this.node.height;
        this.tmpColor = this.lvupText.node.color;
    },

    showLvupWeapon(selWeapon){
        this.selWeapon = selWeapon;
        if(selWeapon){
            this.node.active = true;

            this.node.x = this.selWeapon.node.x;
            this.node.y = this.selWeapon.node.y;
            this.node.width = this.sWidth * this.selWeapon.weaponCfg.attRadius;
            this.node.height = this.sHeight * this.selWeapon.weaponCfg.attRadius;
            this.node.active = true;

            this.btnLvup.interactable = !this.selWeapon.isMaxLevel();
            this.lvupText.string = this.selWeapon.getNextLvCost();
            this.dropText.string = this.selWeapon.weaponCfg.dropMoney;

            this.lvupText.color = cc.battleScene.data.money > 100 ? this.tmpColor : cc.color(255,0,0,255);
        }
    },

    onBtnLvup(){
        if(this.selWeapon){
            this.selWeapon.buildNextLevel();
        }
        this.node.active = false;
    },

    onBtnDrop(){
        if(this.selWeapon){
            this.selWeapon.dropWeapon();
        }
        this.node.active = false;
    },

});
