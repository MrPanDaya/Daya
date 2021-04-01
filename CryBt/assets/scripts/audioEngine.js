// cc.audioEngine扩展
(function () {
    var effectMuted = false; // 音效静音
    var musicMuted = false; // 背景音乐静音
    var effectVolume = 0.5;
    var musicVolume = 1;

    cc.audioEngine.lastMusicFilename = "";
    cc.audioEngine.playingMusic = false;
    cc.audioEngine._lastMusicAsset = null;

    var read = function (key) {
        return LocalStorage.getBool(key, false);
    }

    var write = function (key, val) {
        LocalStorage.setBool(key, val);
    }

    var loadAudioClip = function(filename, callback) {
        cc.resources.load(filename, cc.AudioClip, function (err, clip) {
            callback(err, clip);
        });
    }

    cc.audioEngine.start = function () {
        musicMuted = read("muteMusic")
        effectMuted = read("muteSound")
    }

    cc.audioEngine.setMusicMuted = function (b) {
        musicMuted = b;
        write("muteMusic", b);
        if (b) {
            cc.audioEngine.stopMusic();
        } else if (cc.audioEngine.lastMusicFilename != "") {
            cc.audioEngine.playMusic(cc.audioEngine.lastMusicFilename);
        }
    }

    cc.audioEngine.setEffectMuted = function (b) {
        effectMuted = b;
        write("muteSound", b);
    }

    cc.audioEngine.getMusicMuted = function () {
        return musicMuted;
    }

    cc.audioEngine.getEffectMuted = function () {
        return effectMuted;
    }


    // 播放音乐
    var oldPlayMusic = cc.audioEngine.playMusic.bind(cc.audioEngine);
    cc.audioEngine.playMusic = function (filename) {
        if (cc.audioEngine.playingMusic && cc.audioEngine.lastMusicFilename == filename) {
            // 这个音乐正在播放中，不用再处理了
            return;
        }

        cc.audioEngine.stopMusic();
        cc.audioEngine.lastMusicFilename = filename;
        if (musicMuted) {
            return;
        }
        filename = "sound/" + filename;
        cc.audioEngine.playingMusic = true;  // 先标记已经在播放中了，防止重复调用问题
        loadAudioClip(filename, function (err, clip) {
            if (err) {
                cc.error(err);
                cc.audioEngine.playingMusic = false;
                return;
            }
            if (musicMuted) {
                // 加载完发现静音了，释放资源
                cc.assetManager._releaseManager.tryRelease(clip);
                cc.audioEngine.playingMusic = false;
                return;
            }
            // 增加当前背景音乐的引用计数
            clip.addRef();
            if (cc.audioEngine._lastMusicAsset) {
                // 释放之前的背景音乐资源
                cc.audioEngine._lastMusicAsset.decRef();
            }
            cc.audioEngine._lastMusicAsset = clip;
            oldPlayMusic(clip, true, 0.5);
            cc.audioEngine.setMusicVolume(musicVolume)
        });
    }

    // 停止音乐
    var oldStopMusic = cc.audioEngine.stopMusic.bind(cc.audioEngine);
    cc.audioEngine.stopMusic = function () {
        if (cc.audioEngine._lastMusicAsset) {
            // 释放之前的背景音乐资源
            cc.audioEngine._lastMusicAsset.decRef();
            cc.audioEngine._lastMusicAsset = null;
        }
        cc.audioEngine.playingMusic = false;
        oldStopMusic();
    }

    var effectMap = {};
    var playingEffectInfo = {};
    var holdingEffects = {};
    var clearEffectInfo = function(filepath) {
        var info = playingEffectInfo[filepath];
        if (!info) return;

        info.clip.decRef();
        if (info.clip.refCount == 0) {
            cc.audioEngine.uncache(info.clip);
            delete playingEffectInfo[filepath];
        }
    };

    var releaseHoldingEffects = function() {
        for (var p in holdingEffects) {
            if (holdingEffects[p]) {
                holdingEffects[p].decRef();
                cc.audioEngine.uncache(holdingEffects[p]);
            }
        }
        holdingEffects = {};
    };

    // 播放音效
    var oldPlayEffect = cc.audioEngine.playEffect.bind(cc.audioEngine);
    cc.audioEngine.playEffectImpl = function (filename, loop) {
        if (effectMuted) return;
        filename = "sound/" + filename;
        // console.log("loadAudioClip:"+filename)
        loadAudioClip(filename, function (err, clip) {
            if (err) {
                cc.error(err);
                return;
            }
            if (effectMuted) {
                // 不需要播放音效了，释放音效资源
                cc.assetManager._releaseManager.tryRelease(clip);
                return;
            }

            var audioID = oldPlayEffect(clip, loop);
            if (holdingEffects[filename] === null) {
                // 首次加载需要长时间保留的音效资源，需要增加其引用计数，并记录之。
                clip.addRef();
                holdingEffects[filename] = clip;
            }
            else if (holdingEffects[filename] ===  undefined) {
                // 不需要长期持有的音效，需要在播放时增加引用计数，播放完成减少引用计数
                clip.addRef();
                cc.audioEngine.setFinishCallback(audioID, function(){
                    var info  = playingEffectInfo[filename];
                    if (!info.ids || info.ids.length <= 0) {
                        return;
                    }

                    var idx = info.ids.indexOf(audioID);
                    if (idx >= 0) {
                        info.ids.splice(idx, 1);
                        clearEffectInfo(filename);
                    }
                }.bind(this));

                // 记录当前正在播放的音效
                if (playingEffectInfo[filename] === undefined) {
                    playingEffectInfo[filename] = {};
                }
                playingEffectInfo[filename].clip = clip;
                if (playingEffectInfo[filename].ids === undefined) {
                    playingEffectInfo[filename].ids = [];
                }
                playingEffectInfo[filename].ids.push(audioID);
            }

            cc.audioEngine.setVolume(audioID, effectVolume)
        });
    }

    var oldStopEffect = cc.audioEngine.stopEffect.bind(cc.audioEngine);
    cc.audioEngine.stopEffect = function (filename) {
        filename = "sound/" + filename;
        if (effectMap[filename]) {
            // 还没开播的音效，从播放队列中删除
            delete effectMap[filename];
        }

        // 停掉音效
        var info = playingEffectInfo[filename];
        if (info) {
            if (info.ids && info.ids > 0) {
                for (var i in info.ids) {
                    oldStopEffect(info.ids[i]);
                }
            }
            clearEffectInfo(filename);
        }
    }

    cc.audioEngine.playEffect = function (filename, loop) {
        effectMap[filename] = !!loop;
    }

    cc.audioEngine.updateEffect = function() {
        for (var k in effectMap) {
            cc.audioEngine.playEffectImpl(k, effectMap[k]);
            delete effectMap[k];
        }
    }

    cc.audioEngine.doClear = function() {
        // 停掉所有音效，并释放内存
        cc.audioEngine.stopAllEffects();

        // 清理正在播放的音效
        for (var p in playingEffectInfo) {
            clearEffectInfo(p);
        }
        playingEffectInfo = {};

        // 清理长时间持有的音效
        releaseHoldingEffects();

        cc.audioEngine.uncacheAll();
        effectMap = {};
    }

    cc.audioEngine.clearAllPlayingEffects = function() {
        for (var key in playingEffectInfo) {
            var info = playingEffectInfo[key]
            if(!info) continue;
            info.clip.decRef()
            if(info.clip.refCount === 0){
                cc.audioEngine.uncache(info.clip)
                delete  playingEffectInfo[key]
            }
        }
    }

    cc.audioEngine.setHoldingEffects = function(filePaths) {
        // 释放之前的音效资源
        releaseHoldingEffects();

        // 记录需要 hold 的音效路径
        for (var idx in filePaths) {
            var filePath = "sound/" + filePaths[idx];
            holdingEffects[filePath] = null;
        }
    }
})();
