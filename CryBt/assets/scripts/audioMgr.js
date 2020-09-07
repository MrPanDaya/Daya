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
                boom: "boom",
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
                self.mainMenu = self.audioList["menu1"];
            });
        },

        playMainMenu: function(musicName) {
            // if (!bPlayMainMenu) {
            //     return;
            // }
                         
            audioMgr.stopMainMenu();
            var self = this;
            cc.loader.loadRes("sound/" + musicName, function (err, clip) {
                if (err) {
                    cc.error(err);
                    return;
                }
                if (window.wx && window.wx.createInnerAudioContext) {
                    // 加载背景音乐资源
                    self.wx_music_ac = window.wx.createInnerAudioContext();
                    self.wx_music_ac.loop = true;
                    self.wx_music_ac.src = clip.url;
                    self.wx_music_ac.play();
                } else {
                    self.mainMenu = clip;
                    cc.audioEngine.playMusic(self.mainMenu, true);
                }
            });

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