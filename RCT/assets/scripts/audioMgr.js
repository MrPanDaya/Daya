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

    ctor() {
        this.init();
    },

    // LIFE-CYCLE CALLBACKS:

    init() {
        cc.soundId = {
            move: "move",
            broken: "broken",
            brake: "brake",
            nitrogn: "nitrogn",
            pass: "pass",
            btn: "btn",
        }
        this.audioList = {};
        this.volume = 0.5;
        this.roopSound = {};
        var self = this;
        cc.loader.loadResDir("sound", function (err, assets) {
            for(var key in assets){
                var soundRes = assets[key];
                self.audioList[soundRes.name] = soundRes;
            }
            self.mainMenu = self.audioList["menu1"];
        });
        
    },

    playMainMenu(){
        if(!bPlayMainMenu){
            return;
        }
        
        if (this.mainMenu) {
            cc.audioEngine.playMusic(this.mainMenu, true);
        }
    },

    stopMainMenu(){
        if (this.mainMenu) {
            cc.audioEngine.stopMusic();
        }
    },

    playSound(soundId, bRoop){
        if(!bPlaySound){
            return;
        }
        bRoop = bRoop === undefined ? false : bRoop;
        if(bRoop && this.roopSound[soundId]){
            cc.audioEngine.resume(this.roopSound[soundId]);
        }else{
            var sound = cc.audioEngine.play(this.audioList[soundId], bRoop, this.volume);
            if(bRoop){
                this.roopSound[soundId] = sound;
            }
        }
    },

    stopSound(soundId){
        if(this.roopSound[soundId] !== undefined){
            cc.audioEngine.pause(this.roopSound[soundId]);
        }
    },

    // start () {},
    // update (dt) {},
});
