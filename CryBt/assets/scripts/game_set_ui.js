cc.Class({
    extends: cc.Component,

    properties: {
        musicSelNode: cc.Node,
        musicUnSelNode: cc.Node,

        soundSelNode: cc.Node,
        soundUnSelNode: cc.Node,
    },
    onLoad () {
        this.isMusicMute = true;
        this.isPlaySound = true;
        this.onBtnMusic();
        this.onBtnSound();
    },
    // start () {},
    // update (dt) {},
    onBtnMusic(){
        this.isMusicMute = !this.isMusicMute;
        this.musicSelNode.active = !this.isMusicMute;
        this.musicUnSelNode.active = this.isMusicMute;
    },

    onBtnSound(){
        this.isPlaySound = !this.isPlaySound;
        this.soundSelNode.active = this.isPlaySound;
        this.soundUnSelNode.active = !this.isPlaySound;
    },

    onBtnClose(){
        this.node.active = false;
    },
});
