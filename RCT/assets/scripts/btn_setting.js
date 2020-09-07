/*
* 描述：设置按钮的类
* */
cc.Class({
    extends: cc.Component,

    properties: {
        picSel : cc.SpriteFrame,
        picUnSel: cc.SpriteFrame,
    },

    /*
    * 描述：初始化
    * */
    onLoad () {
        this.img = this.node.getComponent(cc.Sprite);
    },

    /*
    * 描述：设置按钮的选中与不选中状态
    * 参数：sel 是否选中
    * */
    setSelect(sel){
        this.img.spriteFrame =  sel ? this.picSel : this.picUnSel;
    },

    // update (dt) {},
});
