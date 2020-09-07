/*
* 描述：封装的音效、背景音乐的接口
* */
(function () {
    window.audioMgr = {
        /*
        * 描述：初始化
        * */
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

        /*
        * 描述：播放背景音乐
        * */
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

        /*
        * 描述：停止背景音乐
        * */
        stopMainMenu: function() {
            if (this.wx_music_ac) {
                this.wx_music_ac.stop();
                this.wx_music_ac.destroy();
                this.wx_music_ac = undefined;
            } else {
                this.mainMenu && cc.audioEngine.stopMusic();
            }
        },

        /*
        * 描述：播放一个音效
        * 参数：soundId 音效id
        * 参数：bRoop 是否循环播放
        * */
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

        /*
        * 描述：停止一个音效
        * 参数：soundId 要终止的音效id
        * */
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