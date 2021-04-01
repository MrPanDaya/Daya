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
        this.nextBuildMoney = 0;
        this.totalMoney = 0;
    },

    update(dt){
        if(this.totalMoney !== cc.battleScene.data.money){
            this.totalMoney = cc.battleScene.data.money;
            this.lvupText.node.color = this.tmpColor;
            if(this.selWeapon && !this.selWeapon.isMaxLevel() && this.totalMoney < this.nextBuildMoney)
                this.lvupText.node.color = cc.color(255,100,50,255);
        }
    },

    showLvupWeapon(selWeapon){
        this.totalMoney = cc.battleScene.data.money;
        this.selWeapon = selWeapon;
        if(selWeapon){
            this.node.active = true;

            this.node.x = this.selWeapon.node.x;
            this.node.y = this.selWeapon.node.y;
            this.node.width = this.sWidth * this.selWeapon.weaponCfg.attRadius;
            this.node.height = this.sHeight * this.selWeapon.weaponCfg.attRadius;
            this.node.active = true;

            this.btnLvup.interactable = !this.selWeapon.isMaxLevel();
            this.dropText.string = this.selWeapon.weaponCfg.dropMoney;
            var nextCost = this.selWeapon.getNextLvCost();
            this.lvupText.string = nextCost;
            this.lvupText.node.color = this.tmpColor;
            if(!this.selWeapon.isMaxLevel()){
                this.nextBuildMoney = checkNum(nextCost);
                if(this.totalMoney < this.nextBuildMoney)
                    this.lvupText.node.color = cc.color(255,100,50,255);
            }
        }
    },

    onBtnLvup(){
        cc.audioEngine.playEffect("btn");
        if(this.selWeapon){
            this.selWeapon.buildNextLevel();
        }
        this.node.active = false;
    },

    onBtnDrop(){
        //todo 设置一个获得金币的音效
        cc.audioEngine.playEffect("btn");
        if(this.selWeapon){
            this.selWeapon.dropWeapon();
        }
        this.node.active = false;
    },

});
