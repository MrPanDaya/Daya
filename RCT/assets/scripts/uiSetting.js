
cc.Class({
    extends: cc.Component,

    properties: {
        musicNode: cc.Node,
        soundNode: cc.Node,
    },

    start () {
        this.musicSetting = this.musicNode.getComponent("btn_setting");
        this.musicSetting.setSelect(window.bPlayMainMenu);
        this.soundSetting = this.soundNode.getComponent("btn_setting");
        this.soundSetting.setSelect(window.bPlaySound);
    },

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
    onBtnClose(){
        this.node.removeFromParent(true);
    }

    // update (dt) {},
});
