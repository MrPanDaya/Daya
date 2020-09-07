/*
    * 描述：游戏设置界面类
    * */
cc.Class({
    extends: cc.Component,

    properties: {
        musicNode: cc.Node,
        soundNode: cc.Node,
    },

    /*
    * 描述：开始
    * */
    start () {
        this.musicSetting = this.musicNode.getComponent("btn_setting");
        this.musicSetting.setSelect(window.bPlayMainMenu);
        this.soundSetting = this.soundNode.getComponent("btn_setting");
        this.soundSetting.setSelect(window.bPlaySound);
    },

    /*
    * 描述：开关背景音乐的设置按钮
    * */
    onBtnMusic(e){
        window.audioMgr.playSound(cc.soundId.btn);
        window.bPlayMainMenu = !window.bPlayMainMenu;
        this.musicSetting.setSelect(window.bPlayMainMenu);
        if(!window.bPlayMainMenu){
            window.audioMgr.stopMainMenu();
        }else {
            cc.mainPlayer && cc.mainPlayer.startPlay && window.audioMgr.playMainMenu();
        }
    },

    /*
    * 描述：开关游戏音效的设置按钮
    * */
    onBtnSound(e){
        window.audioMgr.playSound(cc.soundId.btn);
        window.bPlaySound = !window.bPlaySound;
        this.soundSetting.setSelect(window.bPlaySound);
        if(cc.mainPlayer && cc.mainPlayer.startPlay){
            if(!window.bPlaySound ){
                window.audioMgr.stopSound(cc.soundId.move);
            }else{
                window.audioMgr.playSound(cc.soundId.move, true);
            }
        }

    },

    /*
    * 描述：关闭设置界面的按钮
    * */
    onBtnClose(){
        this.node.removeFromParent(true);
    }

    // update (dt) {},
});
