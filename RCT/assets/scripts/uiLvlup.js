/*
* 描述：赛车升级界面类
* */
cc.Class({
    extends: cc.Component,

    properties: {
        maxSpeedBar: cc.Node,
        addSpeedBar: cc.Node,
        maxSpeedNBar: cc.Node,
        addSpeedNBar: cc.Node,
        maxNgTimeBar: cc.Node,
        carName: cc.Label,
        labLvup: cc.Label,
        btnLvup: cc.Node
    },

    /*
    * 描述：初始化
    * */
    onLoad () {
        cc.uiLvlup = this;
        this.barMaxWidth = 320;
    },

    // start () {},

    // update (dt) {},

    /*
    * 描述：设置选中汽车的数据
    * 参数：selId 选中汽车的id
    * */
    setSelId(selId){
        this.selId = selId || 0;
        this.selLv = cc.LocalData.levelInfo['car' + this.selId] || 0;
        var carCfg = mainCarCfg['car' + this.selId];
        this.carName.string = carCfg.name;
        this.updateLvupUI();
    },

    /*
    * 描述：刷新升级界面
    * */
    updateLvupUI(){
        var lvupCfg = carLvUpCfg['car' + this.selId];
        this.btnLvup.active = (this.selLv < lvupCfg.lv);
        this.labLvup.string = lvupCfg.lvCost;
        this.labLvup.node.color = cc.LocalData.totalMoney < lvupCfg.lvCost ? cc.color(255, 0, 0, 255) : cc.color(26, 177, 44, 255);
        this.carCfgCur = getCarCfgByLevel(this.selId, this.selLv);
        this.carCfgMax = getCarCfgByLevel(this.selId, lvupCfg.lv);

        this.maxSpeedBar.width = this.barMaxWidth * this.carCfgCur.maxSpeed / this.carCfgMax.maxSpeed;
        this.maxSpeedBar.getChildByName("cur_value").getComponent(cc.Label).string = this.carCfgCur.maxSpeed;

        this.addSpeedBar.width = this.barMaxWidth * this.carCfgCur.addSpeed / this.carCfgMax.addSpeed;
        this.addSpeedBar.getChildByName("cur_value").getComponent(cc.Label).string = this.carCfgCur.addSpeed;

        this.maxSpeedNBar.width = this.barMaxWidth * this.carCfgCur.maxSpeedN / this.carCfgMax.maxSpeedN;
        this.maxSpeedNBar.getChildByName("cur_value").getComponent(cc.Label).string = this.carCfgCur.maxSpeedN;

        this.addSpeedNBar.width = this.barMaxWidth * this.carCfgCur.addSpeedN / this.carCfgMax.addSpeedN;
        this.addSpeedNBar.getChildByName("cur_value").getComponent(cc.Label).string = this.carCfgCur.addSpeedN;

        this.maxNgTimeBar.width = this.barMaxWidth * this.carCfgCur.ngTimer / this.carCfgMax.ngTimer;
        this.maxNgTimeBar.getChildByName("cur_value").getComponent(cc.Label).string = this.carCfgCur.ngTimer;
    },

    /*
    * 描述：关闭设置界面的按钮
    * */
    onClose(){
        window.audioMgr.playSound(cc.soundId.btn);
        this.node.active = false;
    },

    /*
    * 描述：升级按钮的回调
    * */
    onLvlup(){
        window.audioMgr.playSound(cc.soundId.btn);
        var lvupCfg = carLvUpCfg['car' + this.selId];
        if(this.selLv >= lvupCfg.lv || cc.LocalData.totalMoney < lvupCfg.lvCost){
            return;
        }
        this.selLv += 1;
        cc.LocalData.totalMoney -= lvupCfg.lvCost;
        cc.LocalData.levelInfo['car' + this.selId] = this.selLv;
        saveLocalData();
        this.updateLvupUI();
        cc.selRoleScene.onTotalMoneyChanged();
    },
    onLvlupByAd(){

    }
});
