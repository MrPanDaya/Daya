(function(){
    window.bulletType = {
        nor_type: 0,        // 普通类型
        ray_cricle: 1,      // 激光圈，放大，范围攻击
        ray_line: 2,        // 激光束，带跟随
        guide_boom: 3,      // 导弹，匀加速，跟随，范围攻击
    };
    window.weaponCfgList = {};
    window.initWeaponCfg = function(){
        var list = [
            {"id":"1011","assertName":"weapon11","backPic":"weaponBg11","attEffect":"attEffect01","nextLevelId":"1012","att":"8","buildMoney":"100","dropMoney":"50","attSpeed":"0.9","attRadius":"2","bulletEffect":"bulletEffect011","bulletType":"0","bulletSpeed":"10","bulletAccSpeed":"0","bulletMaxSpeed":"10","bulletRadius":"0","sound":"bullet1.mp3"},
            {"id":"1012","assertName":"weapon12","backPic":"weaponBg12","attEffect":"attEffect01","nextLevelId":"1013","att":"9","buildMoney":"200","dropMoney":"150","attSpeed":"0.75","attRadius":"2.5","bulletEffect":"bulletEffect012","bulletType":"0","bulletSpeed":"10","bulletAccSpeed":"0","bulletMaxSpeed":"10","bulletRadius":"0","sound":"bullet1.mp3"},
            {"id":"1013","assertName":"weapon13","backPic":"weaponBg13","attEffect":"attEffect01","nextLevelId":"0","att":"10","buildMoney":"300","dropMoney":"300","attSpeed":"0.55","attRadius":"3","bulletEffect":"bulletEffect013","bulletType":"0","bulletSpeed":"10","bulletAccSpeed":"0","bulletMaxSpeed":"10","bulletRadius":"0","sound":"bullet1.mp3"},
            {"id":"1021","assertName":"weapon21","backPic":"weaponBg21","attEffect":"attEffect02","nextLevelId":"1022","att":"7","buildMoney":"100","dropMoney":"50","attSpeed":"0.85","attRadius":"2","bulletEffect":"bulletEffect021","bulletType":"0","bulletSpeed":"10","bulletAccSpeed":"0","bulletMaxSpeed":"10","bulletRadius":"0","sound":"bullet2.mp3"},
            {"id":"1022","assertName":"weapon22","backPic":"weaponBg22","attEffect":"attEffect02","nextLevelId":"1023","att":"9","buildMoney":"200","dropMoney":"150","attSpeed":"0.7","attRadius":"2.5","bulletEffect":"bulletEffect022","bulletType":"0","bulletSpeed":"10","bulletAccSpeed":"0","bulletMaxSpeed":"10","bulletRadius":"0","sound":"bullet2.mp3"},
            {"id":"1023","assertName":"weapon23","backPic":"weaponBg23","attEffect":"attEffect02","nextLevelId":"0","att":"9.5","buildMoney":"300","dropMoney":"300","attSpeed":"0.5","attRadius":"3","bulletEffect":"bulletEffect023","bulletType":"0","bulletSpeed":"10","bulletAccSpeed":"0","bulletMaxSpeed":"10","bulletRadius":"0","sound":"bullet2.mp3"},
            {"id":"1031","assertName":"weapon31","backPic":"weaponBg31","attEffect":"attEffect03","nextLevelId":"1032","att":"2","buildMoney":"120","dropMoney":"60","attSpeed":"0.8","attRadius":"2.2","bulletEffect":"bulletEffect031","bulletType":"1","bulletSpeed":"3","bulletAccSpeed":"0","bulletMaxSpeed":"3","bulletRadius":"1.2","sound":"bullet3.mp3"},
            {"id":"1032","assertName":"weapon32","backPic":"weaponBg32","attEffect":"attEffect03","nextLevelId":"1033","att":"2.2","buildMoney":"240","dropMoney":"180","attSpeed":"0.65","attRadius":"2.6","bulletEffect":"bulletEffect032","bulletType":"1","bulletSpeed":"3","bulletAccSpeed":"0","bulletMaxSpeed":"3","bulletRadius":"1.5","sound":"bullet3.mp3"},
            {"id":"1033","assertName":"weapon33","backPic":"weaponBg33","attEffect":"attEffect03","nextLevelId":"0","att":"2.6","buildMoney":"360","dropMoney":"360","attSpeed":"0.5","attRadius":"3.2","bulletEffect":"bulletEffect033","bulletType":"1","bulletSpeed":"3","bulletAccSpeed":"0","bulletMaxSpeed":"3","bulletRadius":"1.8","sound":"bullet3.mp3"},
            {"id":"1041","assertName":"weapon41","backPic":"weaponBg41","attEffect":"attEffect04","nextLevelId":"1042","att":"4.5","buildMoney":"120","dropMoney":"60","attSpeed":"0.6","attRadius":"2.5","bulletEffect":"bulletEffect041","bulletType":"2","bulletSpeed":"10","bulletAccSpeed":"0","bulletMaxSpeed":"10","bulletRadius":"0","sound":"bullet4.mp3"},
            {"id":"1042","assertName":"weapon42","backPic":"weaponBg42","attEffect":"attEffect04","nextLevelId":"1043","att":"5.5","buildMoney":"240","dropMoney":"180","attSpeed":"0.5","attRadius":"3","bulletEffect":"bulletEffect042","bulletType":"2","bulletSpeed":"10","bulletAccSpeed":"0","bulletMaxSpeed":"10","bulletRadius":"0","sound":"bullet4.mp3"},
            {"id":"1043","assertName":"weapon43","backPic":"weaponBg43","attEffect":"attEffect04","nextLevelId":"0","att":"6.8","buildMoney":"360","dropMoney":"360","attSpeed":"0.2","attRadius":"3.5","bulletEffect":"bulletEffect043","bulletType":"2","bulletSpeed":"10","bulletAccSpeed":"0","bulletMaxSpeed":"10","bulletRadius":"0","sound":"bullet4.mp3"},
            {"id":"1051","assertName":"weapon51","backPic":"weaponBg51","attEffect":"attEffect05","nextLevelId":"1052","att":"9","buildMoney":"120","dropMoney":"60","attSpeed":"0.8","attRadius":"2.2","bulletEffect":"bulletEffect051","bulletType":"0","bulletSpeed":"10","bulletAccSpeed":"0","bulletMaxSpeed":"10","bulletRadius":"0","sound":"bullet5.mp3"},
            {"id":"1052","assertName":"weapon52","backPic":"weaponBg52","attEffect":"attEffect05","nextLevelId":"1053","att":"10","buildMoney":"240","dropMoney":"180","attSpeed":"0.65","attRadius":"2.6","bulletEffect":"bulletEffect052","bulletType":"0","bulletSpeed":"10","bulletAccSpeed":"0","bulletMaxSpeed":"10","bulletRadius":"0","sound":"bullet5.mp3"},
            {"id":"1053","assertName":"weapon53","backPic":"weaponBg53","attEffect":"attEffect05","nextLevelId":"0","att":"12","buildMoney":"360","dropMoney":"360","attSpeed":"0.5","attRadius":"3.2","bulletEffect":"bulletEffect053","bulletType":"0","bulletSpeed":"10","bulletAccSpeed":"0","bulletMaxSpeed":"10","bulletRadius":"0","sound":"bullet5.mp3"},
            {"id":"1061","assertName":"weapon61","backPic":"weaponBg11","attEffect":"attEffect06","nextLevelId":"1062","att":"7","buildMoney":"120","dropMoney":"60","attSpeed":"0.8","attRadius":"2.4","bulletEffect":"bulletEffect061","bulletType":"0","bulletSpeed":"8","bulletAccSpeed":"0","bulletMaxSpeed":"8","bulletRadius":"1.2","sound":"bullet6.mp3"},
            {"id":"1062","assertName":"weapon62","backPic":"weaponBg12","attEffect":"attEffect06","nextLevelId":"1063","att":"8","buildMoney":"240","dropMoney":"180","attSpeed":"0.65","attRadius":"3","bulletEffect":"bulletEffect062","bulletType":"0","bulletSpeed":"8","bulletAccSpeed":"0","bulletMaxSpeed":"8","bulletRadius":"1.4","sound":"bullet6.mp3"},
            {"id":"1063","assertName":"weapon63","backPic":"weaponBg13","attEffect":"attEffect06","nextLevelId":"0","att":"10","buildMoney":"360","dropMoney":"360","attSpeed":"0.55","attRadius":"3.6","bulletEffect":"bulletEffect063","bulletType":"0","bulletSpeed":"8","bulletAccSpeed":"0","bulletMaxSpeed":"8","bulletRadius":"1.8","sound":"bullet6.mp3"},
            {"id":"1071","assertName":"weapon71","backPic":"weaponBg71","attEffect":"attEffect07","nextLevelId":"1072","att":"10","buildMoney":"160","dropMoney":"80","attSpeed":"1.2","attRadius":"2.5","bulletEffect":"bulletEffect071","bulletType":"3","bulletSpeed":"0","bulletAccSpeed":"20","bulletMaxSpeed":"10","bulletRadius":"1.5","sound":"bullet7.mp3"},
            {"id":"1072","assertName":"weapon72","backPic":"weaponBg72","attEffect":"attEffect07","nextLevelId":"1073","att":"12","buildMoney":"320","dropMoney":"240","attSpeed":"1","attRadius":"3","bulletEffect":"bulletEffect072","bulletType":"3","bulletSpeed":"0","bulletAccSpeed":"20","bulletMaxSpeed":"10","bulletRadius":"2","sound":"bullet7.mp3"},
            {"id":"1073","assertName":"weapon73","backPic":"weaponBg73","attEffect":"attEffect07","nextLevelId":"0","att":"14","buildMoney":"480","dropMoney":"480","attSpeed":"0.8","attRadius":"3.5","bulletEffect":"bulletEffect073","bulletType":"3","bulletSpeed":"0","bulletAccSpeed":"20","bulletMaxSpeed":"10","bulletRadius":"2.5","sound":"bullet7.mp3"},
        ];
        for(var i = 0, len = list.length; i < len; ++i){
            var cfg = list[i];
            weaponCfgList[cfg.id] = cfg;
        }
    };

    initWeaponCfg();
})();
