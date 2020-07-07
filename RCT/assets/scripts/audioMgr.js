// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
(function () {
    window.audioMgr = {
        init: function() {
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
                for (var key in assets) {
                    var soundRes = assets[key];
                    self.audioList[soundRes.name] = soundRes;
                }
            });
        },

        playMainMenu: function() {
            if (!bPlayMainMenu) {
                return;
            }
            if (window.wx && window.wx.createInnerAudioContext) {
                // 加载背景音乐资源
                this.wx_music_ac = window.wx.createInnerAudioContext();
                this.wx_music_ac.loop = true;
                var self = this;
                var menu1_path = "sound/menu1";
                cc.loader.loadRes(menu1_path, function (err, clip) {
                    if (err) {
                        cc.error(err);
                        return;
                    }
                    self.wx_music_ac.src = clip.url;
                    self.wx_music_ac.play();
                });
            } else {
                this.mainMenu && cc.audioEngine.playMusic(this.mainMenu, true);
            }
        },

        stopMainMenu: function() {
            if (this.wx_music_ac) {
                this.wx_music_ac.stop();
                this.wx_music_ac.destroy();
                this.wx_music_ac = undefined;
            } else {
                this.mainMenu && cc.audioEngine.stopMusic();
            }
        },

        playSound: function(soundId, bRoop) {
            if (!bPlaySound) {
                return;
            }
            bRoop = bRoop === undefined ? false : bRoop;
            if (window.wx && window.wx.createInnerAudioContext) {
                if(this.roopSound[soundId] && this.roopSound[soundId]){
                    this.roopSound[soundId].play();
                    return;
                }
                // 加载背景音乐资源
                this.roopSound[soundId] = window.wx.createInnerAudioContext();
                this.roopSound[soundId].loop = bRoop;
                var self = this;
                var menu1_path = "sound/" + soundId;
                cc.loader.loadRes(menu1_path, function (err, clip) {
                    if (err) {
                        cc.error(err);
                        return;
                    }
                    self.roopSound[soundId].src = clip.url;
                    self.roopSound[soundId].play();
                });
            }else{
                if(bRoop && this.roopSound[soundId]){
                    cc.audioEngine.resumeEffect(this.roopSound[soundId]);
                }else{
                    var sound = cc.audioEngine.playEffect(this.audioList[soundId], bRoop, this.volume);
                    if (bRoop) {
                        this.roopSound[soundId] = sound;
                    }
                }
            }
        },

        stopSound: function(soundId) {
            if (window.wx && window.wx.createInnerAudioContext && this.roopSound[soundId]) {
                this.roopSound[soundId].stop();
                if(this.roopSound[soundId].loop){
                    console.log("========stopSound========");
                    this.roopSound[soundId].destroy();
                    this.roopSound[soundId] = undefined;
                }
            }else if (this.roopSound[soundId] !== undefined) {
                cc.audioEngine.stopEffect(this.roopSound[soundId]);
                this.roopSound[soundId] = undefined;
            }
        },
    }
})();