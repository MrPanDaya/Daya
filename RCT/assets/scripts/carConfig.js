/*
    * 描述：游戏本地数据及接口类
    * */
(function(){
    window.bPlayMainMenu = true;
    window.bPlaySound = true;
    window.ngTotalCDTimer = 15;

    /*
    * 描述：难度等级配置
    * */
    window.hardLvCfg = {
        0 : {
            posY: -250,
            disY: 8000,
            aiCarTimer: 0.6,
        },
        1 : {
            posY: -200,
            disY: 20000,
            aiCarTimer: 0.5,
        },
        2 : {
            posY: -150,
            disY: 40000,
            aiCarTimer: 0.45,
        },
        3 : {
            posY: -150,
            disY: 60000,
            aiCarTimer: 0.4,
        },
        4 : {
            posY: -100,
            disY: 80000,
            aiCarTimer: 0.35,
        },
        5 : {
            posY: 0,
            disY: 100000,
            aiCarTimer: 0.3,
        },
    }

    /*
    * 描述：赛车配置
    * */
    window.mainCarCfg = {
        car0 : {
            img: 'img/main_scene/car01',
            name: '急速一号',
            achorF : 0.2,       // 前轮锚点
            achorB : 0.8,       // 后轮锚点
            carAng : 12,        // 转向的角度
            maxSpeedX : 500,    // 水平的最大速度
            maxSpeed : 1800,    // 最大速度
            maxSpeedN : 2000,   // 氮气加速的最大速度
            addSpeed : 600,
            addSpeedN : 700,
            turnTime : 0.15,    // 转向时间
            recoverTime: 0.1,   // 恢复时间
            ngTimer: 5,  // 氮气加速的时间
            unLockMoney: 0,     // 解锁消耗的金币
        },
        car1 : {
            img: 'img/main_scene/car02',
            name: '急速二号',
            achorF : 0.2,       // 前轮锚点
            achorB : 0.8,       // 后轮锚点
            carAng : 12,        // 转向的角度
            maxSpeedX : 500,    // 水平的最大速度
            maxSpeed : 1800,    // 最大速度
            maxSpeedN : 2000,   // 氮气加速的最大速度
            addSpeed : 600,
            addSpeedN : 700,
            turnTime : 0.15,    // 转向时间
            recoverTime: 0.1,   // 恢复时间
            ngTimer: 5,  // 氮气加速的时间
            unLockMoney: 1000,  // 解锁消耗的金币
        },
        car2 : {
            img: 'img/main_scene/car03',
            name: '急速三号',
            achorF : 0.2,       // 前轮锚点
            achorB : 0.8,       // 后轮锚点
            carAng : 12,        // 转向的角度
            maxSpeedX : 500,    // 水平的最大速度
            maxSpeed : 1800,    // 最大速度
            maxSpeedN : 2000,   // 氮气加速的最大速度
            addSpeed : 600,
            addSpeedN : 700,
            turnTime : 0.15,    // 转向时间
            recoverTime: 0.1,   // 恢复时间
            ngTimer: 5,  // 氮气加速的时间
            unLockMoney: 5000,  // 解锁消耗的金币
        },
        car3 : {
            img: 'img/main_scene/car04',
            name: '清纯一号',
            achorF : 0.2,       // 前轮锚点
            achorB : 0.8,       // 后轮锚点
            carAng : 12,        // 转向的角度
            maxSpeedX : 500,    // 水平的最大速度
            maxSpeed : 1800,    // 最大速度
            maxSpeedN : 2000,   // 氮气加速的最大速度
            addSpeed : 600,
            addSpeedN : 700,
            turnTime : 0.15,    // 转向时间
            recoverTime: 0.1,   // 恢复时间
            ngTimer: 5,  // 氮气加速的时间
            unLockMoney: 20000, // 解锁消耗的金币
        },
        car4 : {
            img: 'img/main_scene/car05',
            name: '清纯二号',
            achorF : 0.2,       // 前轮锚点
            achorB : 0.8,       // 后轮锚点
            carAng : 12,        // 转向的角度
            maxSpeedX : 500,    // 水平的最大速度
            maxSpeed : 1800,    // 最大速度
            maxSpeedN : 2000,   // 氮气加速的最大速度
            addSpeed : 600,
            addSpeedN : 700,
            turnTime : 0.15,    // 转向时间
            recoverTime: 0.1,   // 恢复时间
            ngTimer: 5,  // 氮气加速的时间
            unLockMoney: 50000, // 解锁消耗的金币
        },
        car5 : {
            img: 'img/main_scene/car06',
            name: '热情速吧',
            achorF : 0.2,       // 前轮锚点
            achorB : 0.8,       // 后轮锚点
            carAng : 12,        // 转向的角度
            maxSpeedX : 500,    // 水平的最大速度
            maxSpeed : 1800,    // 最大速度
            maxSpeedN : 2000,   // 氮气加速的最大速度
            addSpeed : 600,
            addSpeedN : 700,
            turnTime : 0.15,    // 转向时间
            recoverTime: 0.1,   // 恢复时间
            ngTimer: 5,  // 氮气加速的时间
            unLockMoney: 80000, // 解锁消耗的金币
        }
    };

    /*
    * 描述：赛车升级配置
    * */
    window.carLvUpCfg = {
        car0 : {
            lv: 4,
            lvCost: 10000,
            maxSpeed : 100,
            maxSpeedN : 100,
            addSpeed : 50,
            addSpeedN : 50,
            ngTimer: 1
        },
        car1 : {
            lv: 4,
            lvCost: 10000,
            maxSpeed : 100,
            maxSpeedN : 100,
            addSpeed : 50,
            addSpeedN : 50,
            ngTimer: 1
        },
        car2 : {
            lv: 4,
            lvCost: 10000,
            maxSpeed : 100,
            maxSpeedN : 100,
            addSpeed : 50,
            addSpeedN : 50,
            ngTimer: 1
        },
        car3 : {
            lv: 4,
            lvCost: 10000,
            maxSpeed : 100,
            maxSpeedN : 100,
            addSpeed : 50,
            addSpeedN : 50,
            ngTimer: 1
        },
        car4 : {
            lv: 5,
            lvCost: 15000,
            maxSpeed : 100,
            maxSpeedN : 100,
            addSpeed : 60,
            addSpeedN : 60,
            ngTimer: 1
        },
        car5 : {
            lv: 5,
            lvCost: 15000,
            maxSpeed : 100,
            maxSpeedN : 100,
            addSpeed : 60,
            addSpeedN : 60,
            ngTimer: 1
        }
    };

    /*
    * 描述：ai车配置配置
    * */
    window.aiCarCfg = {
        car0 : {
            img: 'img/main_scene/ncar01',
            speed : 1000,
            height : 204,
        },
        car1 : {
            img: 'img/main_scene/ncar02',
            speed : 950,
            height : 410,
        },
        car2 : {
            img: 'img/main_scene/ncar03',
            speed : 1050,
            height : 190,
        },
        car3 : {
            img: 'img/main_scene/ncar04',
            speed : 1000,
            height : 199,
        },
        car4 : {
            img: 'img/main_scene/ncar05',
            speed : 1000,
            height : 231,
        },
        car5 : {
            img: 'img/main_scene/ncar06',
            speed : 1000,
            height : 203,
        },
        car6 : {
            img: 'img/main_scene/ncar07',
            speed : 1000,
            height : 186,
        },
        car7 : {
            img: 'img/main_scene/ncar08',
            speed : 1000,
            height : 185,
        },
        car8 : {
            img: 'img/main_scene/ncar09',
            speed : 950,
            height : 270,
        },
        car9 : {
            img: 'img/main_scene/ncar10',
            speed : 1000,
            height : 206,
        },
        car10 : {
            img: 'img/main_scene/ncar11',
            speed : 1000,
            height : 204,
        },
        car11 : {
            img: 'img/main_scene/ncar12',
            speed : 1000,
            height : 187,
        },
        car12 : {
            img: 'img/main_scene/ncar13',
            speed : 1000,
            height : 163,
        },
        car13 : {
            img: 'img/main_scene/ncar14',
            speed : 1000,
            height : 163,
        },
        car14 : {
            img: 'img/main_scene/ncar15',
            speed : 1000,
            height : 203,
        },
        car15 : {
            img: 'img/main_scene/ncar16',
            speed : 1000,
            height : 198,
        }
    };

    /*
    * 描述：初始化本地数据
    * */
    window.initLocalData = function () {
        var defData = {
            selectCar : 0,
            maxScore: 0,
            totalMoney: 0,
            unLockInfo:{
                car0: 1,
            },
            levelInfo:{
                car0: 0,
            }
        }
        cc.LocalData = LocalStorage.getObject("RctData", defData);
        saveLocalData();
    };

    /*
    * 描述：保存本地数据
    * */
    window.saveLocalData = function () {
        if(cc.LocalData){
            LocalStorage.setObject("RctData", cc.LocalData);
        }
    };

    /*
    * 描述：根据等级获取汽车的配置
    * 参数：selId 选中的汽车id
    * 参数：lv 汽车等级
    * */
    window.getCarCfgByLevel = function(selId, lv){
        var carCfg = mainCarCfg['car' + selId];
        var str = JSON.stringify(carCfg);
        var cfg = JSON.parse(str);
        if(lv > 0){
            var lvupCfg = carLvUpCfg['car' + selId];
            if(lv > lvupCfg.lv){
                lv = lvupCfg.lv;
            }
            cfg.maxSpeed += lvupCfg.maxSpeed * lv;
            cfg.maxSpeedN += lvupCfg.maxSpeedN * lv;
            cfg.addSpeed += lvupCfg.addSpeed * lv;
            cfg.addSpeedN += lvupCfg.addSpeedN * lv;
            cfg.ngTimer += lvupCfg.ngTimer * lv;
        }

        return cfg;
    };

    /*
    * 描述：分享接口
    * 参数：params 分享的参数
    * 参数：callBack 分享的回调
    * */
    window.shareApp = function(params, callBack){
        if(wx && wx.shareAppMessage){
            var args = {};
            if (params.title) {
                args.title = params.title;
            }
            // 携带参数分享，带到 query 中
            if (params.query) {
                args.query = params.query;
            }
            // 如果有指定分享图片，按照 imgpath、imgurl 的顺序显示图片
            // 如果没有指定，使用当前截屏
            if (params.imgpath) {
                args.imageUrl = params.imgpath;
            } else if (params.imgurl) {
                args.imageUrl = params.imgurl;
            }
            wx.shareAppMessage(args);
        }
    };

    /*
    * 描述：初始化微信小程序的事件
    * */
    window.initWXEvent = function(){
        if(!window.wx) return;
        if(window.initWX) return;
        window.initWX = true;
        wx.onShow(function (opt) {

        });

        wx.onHide(function () {
            if(cc.mainPlayer && cc.mainPlayer.startPlay){
                cc.mainScene.onBtnPause();
            }
        });
    };

    /*
        *描述: 截屏 参数单位为微信的canvas单位
        *参数: x 起点x坐标
        *参数: y 起点y坐标
        *参数: w 宽度
        *参数: h 高度
        *参数: callback 截屏回调
    */
    window.captureScreen = function(x, y, w, h, callback){
        if (!window.wx) {
            return
        }
        canvas.toTempFilePath({
            x: x,
            y: y,
            width: w,
            height: h,
            destWidth: 500,
            destHeight: 400,
            complete:function(res) {
                callback && callback(res);
            },
            fail:function(res){
                console.log("ShareLogic.captureScreen failed:", res);
                callback && callback(undefined, "截屏失败");
            }
        });
    };

    /*
    * 描述：分享至小游戏的接口
    * 参数：params 分享的参数
    * */
    window.shareByMiniGame = function (params) {
        params.imageUrl = cc.url.raw('share.jpg');
        wx.shareAppMessage(params);
    };

    window.ADList = {
        ad0 : undefined,
        ad1 : undefined,
        ad2 : undefined,
    };
    window.initADList = function(){
        if (!window.wx) {
            return
        }
        let adInitFnt = function(adId){
            let  ad = wx.createRewardedVideoAd({
                adUnitId: adId
            });
            ad.onError(function (res) {
                console.error(res);
            })
            return ad;
        };
        if(ADList.ad0 === undefined)
            ADList.ad0 = adInitFnt('adunit-ca5fb4a5cec2cfb4');
        if(ADList.ad1 === undefined)
            ADList.ad1 = adInitFnt('adunit-649127a5b3e8405b');
        if(ADList.ad2 === undefined)
            ADList.ad2 = adInitFnt('adunit-c191cce7d7821ebc');
    };
    /*
    * 描述：小游戏看广告的接口
    * 参数：adType = 0、1、2 ==》 15、30、60秒视频
    * */
    window.showAD = function (adType, callBack) {
        if (!window.wx) {
            return
        }
        // 创建激励视频广告实例，提前初始化
        let videoAd = ADList["ad" + adType];
        if(videoAd === undefined){
            console.log("videoAd is undefined");
            if(callBack)
                callBack(1);
            return;
        }

        var closeCallback = function (res) {
            this.offClose(closeCallback);
            if (callBack) {
                callBack(0, res.isEnded);
            }
        }.bind(videoAd);
        videoAd.offClose(closeCallback);
        videoAd.onClose(closeCallback);

        // 用户触发广告后，显示激励视频广告
        videoAd.show().catch(() => {
            // 失败重试
            videoAd.load()
                .then(() => videoAd.show())
                .catch(err => {
                    if(callBack)
                        callBack(2);
                    console.log('激励视频 广告显示失败')
                })
        })
    };

})();
