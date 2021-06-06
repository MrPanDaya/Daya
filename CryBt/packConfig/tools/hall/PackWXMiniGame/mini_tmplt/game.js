"use strict";

require('adapter-min.js');

__globalAdapter.init();

var fnCopyFile = fsUtils.copyFile;
fsUtils.copyFile = function(srcPath, destPath, onComplete) {
  var prefix = fsUtils.getUserDataPath() + "/";
  var pth = destPath.substr(destPath.indexOf(prefix) + prefix.length);
  var folders = pth.split("/");
  folders.pop();//pop filename

  var folder = prefix;
  var fs = wx.getFileSystemManager();
  var ensure = function() {
    if (folders.length) {
      folder += folders.shift() + "/";
      fsUtils.exists(folder, function(exists) {
        if (exists)
          ensure();
        else {
          fs.mkdir({//recursive: true,//2.3.0
            dirPath: folder,
            success: function() {
              ensure();
            },
            fail: function() {
            },
          });
        }
      });
    }
    else {
      fnCopyFile(srcPath, destPath, onComplete);
    }
  };
  ensure();
};

require('cocos/cocos2d-js-min.js');

__globalAdapter.adaptEngine();

require('./ccRequire');

require('./src/settings'); // Introduce Cocos Service here


require('./main'); // TODO: move to common
// Adjust devicePixelRatio


cc.view._maxPixelRatio = 2;

if (cc.sys.platform !== cc.sys.WECHAT_GAME_SUB) {
  // Release Image objects after uploaded gl texture
  cc.macro.CLEANUP_IMAGE_CACHE = true;
}

window.boot();