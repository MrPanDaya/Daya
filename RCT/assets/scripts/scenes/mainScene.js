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
        bgArray: [cc.Node],
        roadResList: [cc.Prefab],
        aiCarPrefab: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.mainScene = this;
        this.maxScore = cc.LocalData.maxScore || 0;
        this.roadNum = 7;
        this.bgHeight = 260 * this.roadNum;
        cc.carSpeed = 0;
        for (var i = 0; i < this.bgArray.length; ++i) {
            for (var j = 0; j < this.roadNum; ++j) {
                var road = cc.instantiate(this.roadResList[0]);
                this.bgArray[i].addChild(road);
                road.y = -780 + j * 260;
            }
            this.bgArray[i].y = this.bgHeight * (i - 1);
        }
        this.curBgId = 0;
        this.lastBgId = 1;

        this.maxCarSpeed = 3000;
        this.pointMinRot = 105;
        this.pointMaxRot = -105;
        this.rancingPoint = cc.find('Canvas/main_ui_node/racing_point');
        this.rancingPoint.angle = this.pointMinRot;

        this.carSpeedLab = cc.find('Canvas/main_ui_node/car_speed').getComponent(cc.Label);
        this.btnStart = cc.find('Canvas/main_ui_node/btnStart');
        this.menuNode = cc.find("Canvas/menu_ui_node").getComponent("uiMenu");
        this.endNode = cc.find("Canvas/end_ui_node").getComponent("uiGameEnd");

        // 开启物理引擎
        var phyMgr = cc.director.getPhysicsManager();
        phyMgr.enabled = true;
        phyMgr.gravity = cc.v2(0,0);
        // 开启调试
        phyMgr.debugDrawFlags = cc.PhysicsManager.DrawBits.e_jointBit | cc.PhysicsManager.DrawBits.e_shapeBit;

        this.initAiCar();
    },

    start() {
        if (cc.mainPlayer) {
            var selId = cc.LocalData.selectCar || 0;
            cc.mainPlayer.initCar(selId);
        }
        if(this.menuNode){
            this.menuNode.setVisible(false);
        }
        if(this.endNode){
            this.endNode.setVisible(false);
        }
    },

    update(dt) {
        if (cc.carSpeed === undefined || this.pause) {
            return;
        }
        this.carSpeedLab.string = Math.floor(cc.carSpeed/10)+"km/h";
        var rota = this.pointMinRot + (this.pointMaxRot - this.pointMinRot) * cc.carSpeed / this.maxCarSpeed;
        this.rancingPoint.angle = rota;

        if(cc.carSpeed <= 0){
            return;
        }
        
        var disY = dt * cc.carSpeed * -1;
        for (var i = 0; i < this.bgArray.length; ++i) {
            var posY = this.bgArray[i].y + disY;
            this.bgArray[i].y += disY;
            if (posY <= -this.bgHeight) {
                var dltY = posY + this.bgHeight;
                this.bgArray[i].y = this.bgHeight + dltY;
            } else {
                this.bgArray[i].y = posY;
            }
        }
        this.score -= disY / 10;
        var totalDis = Math.floor(this.score);
        this.scoreLabel.string = totalDis;
        if (this.scoreNode.width >= 180) {
            this.scoreBg.width = this.scoreNode.width + 20;
        }

        this.updateAiCar(dt);
    },

    onDestroy() {
        cc.audioMgr.stopMainMenu();
    },

    onBtnStartGame() {
        cc.audioMgr.playSound(cc.soundId.btn);
        cc.audioMgr.playMainMenu();

        if (this.btnStart) {
            this.btnStart.active = false;
        }
        if (this.menuNode) {
            this.menuNode.setVisible(false);
        }

        // 开启物理系统
        cc.director.getPhysicsManager().enabled = true;

        this.pause = false;
        this.score = 0;
        this.addMoney = 0;
        this.scoreBg = cc.find('Canvas/main_ui_node/scoreBg');
        this.scoreNode = cc.find('Canvas/main_ui_node/scoreBg/score');
        this.scoreLabel = this.scoreNode.getComponent(cc.Label);
        this.scoreLabel.string = this.score;

        if (cc.mainPlayer) {
            cc.mainPlayer.onStartPlay();
        }
    },

    onBtnPause() {
        cc.audioMgr.playSound(cc.soundId.btn);
        if(cc.mainPlayer.isBroken){
            return;
        }
        this.pause = true;
        if (cc.mainPlayer) {
            cc.mainPlayer.onCarPause(true);
        }
        cc.audioMgr.stopMainMenu();
        if (this.menuNode) {
            this.menuNode.setVisible(true);
        }
        // 暂停物理系统
        cc.director.getPhysicsManager().enabled = false;
    },

    onGameStop(){
        if(cc.mainPlayer){ 
            cc.mainPlayer.onCarBroken();
        }
        cc.audioMgr.stopMainMenu();
        // 计算分数
        this.score = Math.floor(this.score);
        if(this.score > this.maxScore){
            this.maxScore = this.score;
            cc.LocalData.maxScore = this.maxScore;
            saveLocalData();
        }
        // 计算金币
        var baseMoney = Math.floor(this.score/20);
        var extMoney = 10;
        this.addMoney = baseMoney + extMoney;
        cc.LocalData.totalMoney += this.addMoney;
        saveLocalData();
        // 显示结算界面
        if (this.endNode) {
            this.endNode.setVisible(true);
        }
    },

    initAiCar(){
        this.randCarTimer = 0;
        this.carNode = cc.find("Canvas/car_node");
        this.aiCarPool = new cc.NodePool();
        for(var i = 0; i < 5; ++i){
            var aiCar = cc.instantiate(this.aiCarPrefab);
            this.aiCarPool.put(aiCar);
        }
    },

    updateAiCar(dt){
        this.randCarTimer += dt;
        if(this.randCarTimer < 1){
            return;
        }
        this.randCarTimer = 0;
        var aiCar = null;
        if(this.aiCarPool.size() > 0){
            aiCar = this.aiCarPool.get();
        }else{
            aiCar = cc.instantiate(this.aiCarPrefab);
        }
        aiCar.parent = this.carNode;
        aiCar.getComponent("aiCar").initAiCar(this);
    },

    removeAiCar(aiCar){
        if(!aiCar){
            return;
        }
        this.aiCarPool.put(aiCar);
    }

});
