(function(){
    window.bPlayMainMenu = true;
    window.bPlaySound = true;
    window.ngTotalCDTimer = 15;

    // 难度等级配置
    window.hardLvCfg = {
        0 : {
            posY: -250,
            disY: 8000,
            aiCarTimer: 1,
        },
        1 : {
            posY: -200,
            disY: 20000,
            aiCarTimer: 0.9,
        },
        2 : {
            posY: -150,
            disY: 40000,
            aiCarTimer: 0.9,
        },
        3 : {
            posY: -150,
            disY: 60000,
            aiCarTimer: 0.9,
        },
        4 : {
            posY: -100,
            disY: 80000,
            aiCarTimer: 0.9,
        },
        5 : {
            posY: 0,
            disY: 100000,
            aiCarTimer: 0.9,
        },
    }

    // 赛车配置
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

    // 赛车升级配置
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

    // ai车配置
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

    window.saveLocalData = function () {
        if(cc.LocalData){
            LocalStorage.setObject("RctData", cc.LocalData);
        }
    };

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

})();
