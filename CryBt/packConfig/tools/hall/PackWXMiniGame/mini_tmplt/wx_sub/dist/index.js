/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _libs_core_boot__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./libs/core/boot */ "./libs/core/boot.js");
/* harmony import */ var _libs_core_boot__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_libs_core_boot__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _libs_core_init__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./libs/core/init */ "./libs/core/init.js");
/* harmony import */ var _src_RankScene__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./src/RankScene */ "./src/RankScene.js");
/* harmony import */ var _src_yftx_YftxViewFunc__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/yftx/YftxViewFunc */ "./src/yftx/YftxViewFunc.js");




var scene = new _src_RankScene__WEBPACK_IMPORTED_MODULE_2__["default"]();
sub.curScene = scene;
scene.registerViewFunc(_src_yftx_YftxViewFunc__WEBPACK_IMPORTED_MODULE_3__["default"].TYPE_NAME, _src_yftx_YftxViewFunc__WEBPACK_IMPORTED_MODULE_3__["default"]);

/***/ }),

/***/ "./libs/core/boot.js":
/*!***************************!*\
  !*** ./libs/core/boot.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

var FIT_MODE = {
  equelWidth: 0,
  equelHeight: 1
};
GameGlobal.sub = {};
sub.touchScaleFactor = -1;
sub.fitMode = 0;
sub.designResolution = {
  width: 1280,
  height: 720
};
sub.sysInfo = wx.getSystemInfoSync();
sub.canvas = wx.getSharedCanvas ? wx.getSharedCanvas() : wx.createCanvas();
sub.maxRatio = wx.getSystemInfoSync().platform == "devtools" ? 1 : 2;

(function () {
  var width = sub.canvas.width;
  var height = sub.canvas.height;
  var factor = width > height ? width / height : height / width;
  var maxFactor = 16.0 / 9.0 + 0.01;

  if (factor > maxFactor) {
    sub.fitMode = 1;
    console.log("sub content fit with height");
  } else {
    console.log("sub content fit with height");
    sub.fitMode = 0;
  }
})();

if (!wx.getSharedCanvas) {
  sub.canvas.width = sub.sysInfo.pixelRatio * sub.canvas.width;
  sub.canvas.height = sub.sysInfo.pixelRatio * sub.canvas.height;
}

sub.ctx = sub.canvas.getContext('2d');

sub.onCanvasSizeChange = function (designResolution) {
  sub.designResolution = designResolution;
  sub.scaleFactor = sub.canvas.height / sub.designResolution.height;

  if (sub.fitMode == FIT_MODE.equelWidth) {
    sub.scaleFactor = sub.canvas.width / sub.designResolution.width;
  }

  if (sub.touchScaleFactor < 0) {
    sub.touchScaleFactor = sub.scaleFactor;
  }

  console.log("++++++++++++onCanvasSizeChange", sub.touchScaleFactor, sub.scaleFactor, sub.canvas.width, sub.canvas.height);
  sub.display = {
    width: sub.canvas.width / sub.scaleFactor,
    height: sub.canvas.height / sub.scaleFactor
  };
};

sub.onCanvasSizeChange(sub.designResolution);

sub.p = function (x, y) {
  return {
    x: x,
    y: y
  };
};

sub.size = function (w, h) {
  return {
    width: w,
    height: h
  };
};

sub.rect = function (x, y, w, h) {
  return {
    x: x,
    y: y,
    width: w,
    height: h
  };
};

sub.color = function (r, g, b, a) {
  return {
    r: r,
    g: g,
    b: b,
    a: a
  };
};

sub.deg2rad = function (deg) {
  return deg / 180 * Math.PI;
};

sub.pRotate = function (origin, target, degree) {
  var vector = sub.p(target.x - origin.x, target.y - origin.y);
  var rad = sub.deg2rad(degree);
  var x = vector.x * Math.cos(rad) - vector.y * Math.sin(rad) + origin.x;
  var y = vector.x * Math.sin(rad) + vector.y * Math.cos(rad) + origin.y;
  return sub.p(x, y);
};

sub.screen2WorldPoint = function (p) {
  var x = p.x / sub.scaleFactor;
  var y = (sub.canvas.height - p.y) / sub.scaleFactor;
  return sub.p(x, y);
};

sub.world2ScreenPoint = function (p) {
  var x = p.x * sub.scaleFactor;
  var y = sub.canvas.height - p.y * sub.scaleFactor;
  return sub.p(x, y);
};

sub.screen2WorldSize = function (size) {
  var w = size.width / sub.scaleFactor;
  var h = size.height / sub.scaleFactor;
  return sub.size(w, h);
};

sub.world2ScreenSize = function (size) {
  var w = size.width * sub.scaleFactor;
  var h = size.height * sub.scaleFactor;
  return sub.size(w, h);
};

sub.pSub = function (pos1, pos2) {
  return {
    x: pos1.x - pos2.x,
    y: pos1.y - pos2.y
  };
};

sub.pGetLengh = function (pos) {
  return Math.sqrt(pos.x * pos.x + pos.y * pos.y);
};

sub.pGetDistance = function (startP, endP) {
  return sub.pGetLengh(sub.pSub(startP, endP));
};

/***/ }),

/***/ "./libs/core/init.js":
/*!***************************!*\
  !*** ./libs/core/init.js ***!
  \***************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _loader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./loader */ "./libs/core/loader.js");
/* harmony import */ var _ticker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ticker */ "./libs/core/ticker.js");
/* harmony import */ var _input_mgr__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./input_mgr */ "./libs/core/input_mgr.js");
/* harmony import */ var _message_mgr__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./message_mgr */ "./libs/core/message_mgr.js");
/* harmony import */ var _node__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node */ "./libs/core/node.js");
/* harmony import */ var _scene__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./scene */ "./libs/core/scene.js");
/* harmony import */ var _sprite__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./sprite */ "./libs/core/sprite.js");
/* harmony import */ var _label__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./label */ "./libs/core/label.js");
/* harmony import */ var _widget_scale9sprite__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../widget/scale9sprite */ "./libs/widget/scale9sprite.js");
/* harmony import */ var _widget_scrollview__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../widget/scrollview */ "./libs/widget/scrollview.js");
/* harmony import */ var _widget_rankview__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../widget/rankview */ "./libs/widget/rankview.js");
/* harmony import */ var _widget_font_label__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../widget/font_label */ "./libs/widget/font_label.js");
/* harmony import */ var _widget_button__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../widget/button */ "./libs/widget/button.js");

sub.Loader = _loader__WEBPACK_IMPORTED_MODULE_0__["default"];

sub.Ticker = _ticker__WEBPACK_IMPORTED_MODULE_1__["default"];

sub.InputManager = _input_mgr__WEBPACK_IMPORTED_MODULE_2__["default"];

sub.MessageManager = _message_mgr__WEBPACK_IMPORTED_MODULE_3__["default"];

sub.Node = _node__WEBPACK_IMPORTED_MODULE_4__["default"];

sub.Scene = _scene__WEBPACK_IMPORTED_MODULE_5__["default"];

sub.Sprite = _sprite__WEBPACK_IMPORTED_MODULE_6__["default"];

sub.Label = _label__WEBPACK_IMPORTED_MODULE_7__["default"];

sub.Scale9Sprite = _widget_scale9sprite__WEBPACK_IMPORTED_MODULE_8__["default"];

sub.ScrollView = _widget_scrollview__WEBPACK_IMPORTED_MODULE_9__["default"];

sub.RankView = _widget_rankview__WEBPACK_IMPORTED_MODULE_10__["default"];

sub.FontLabel = _widget_font_label__WEBPACK_IMPORTED_MODULE_11__["default"];

sub.Button = _widget_button__WEBPACK_IMPORTED_MODULE_12__["default"];

/***/ }),

/***/ "./libs/core/input_mgr.js":
/*!********************************!*\
  !*** ./libs/core/input_mgr.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return InputManager; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var instance = null;

var InputManager =
/*#__PURE__*/
function () {
  function InputManager() {
    _classCallCheck(this, InputManager);

    if (instance) {
      throw new Error('sub.InputManager is a singleton object, please use "sub.InputManager.instance" instead.');
    }

    this.__listeners__ = new Array();
    wx.onTouchStart(function (res) {
      this._dispatchTouchEvent(res, InputManager.TOUCH_PHASE.BEGAN);
    }.bind(this));
    wx.onTouchMove(function (res) {
      this._dispatchTouchEvent(res, InputManager.TOUCH_PHASE.MOVED);
    }.bind(this));
    wx.onTouchEnd(function (res) {
      this._dispatchTouchEvent(res, InputManager.TOUCH_PHASE.ENDED);
    }.bind(this));
    wx.onTouchCancel(function (res) {
      this._dispatchTouchEvent(res, InputManager.TOUCH_PHASE.CANCELED);
    }.bind(this));
  }

  _createClass(InputManager, [{
    key: "addListener",
    value: function addListener(listener) {
      if (typeof listener != 'function') {
        throw new Error('Invaild argument.');
      }

      var index = this.__listeners__.indexOf(listener);

      if (index != -1) {
        return listener;
      }

      this.__listeners__.push(listener);

      return listener;
    }
  }, {
    key: "removeListener",
    value: function removeListener(listener) {
      if (typeof listener != 'function') {
        throw new Error('Invaild argument.');
      }

      var index = this.__listeners__.indexOf(listener);

      if (index == -1) {
        return;
      }

      this.__listeners__.splice(index, 1);
    }
  }, {
    key: "_dispatchTouchEvent",
    value: function _dispatchTouchEvent(res, phase) {
      var changedTouches = res.changedTouches;

      if (!changedTouches) {
        throw new Error('Input error: cannot get the touch data.');
      }

      var x = changedTouches[0].clientX / sub.touchScaleFactor;
      var y = changedTouches[0].clientY / sub.touchScaleFactor;
      var screenPos = sub.p(x, y);
      var worldPos = sub.screen2WorldPoint(screenPos);
      var touch = {
        phase: phase,
        id: changedTouches[0].identifier,
        screenPos: screenPos,
        worldPos: worldPos
      };

      this.__listeners__.forEach(function (listener) {
        listener(touch);
      });
    }
  }], [{
    key: "instance",
    get: function get() {
      if (!instance) {
        instance = new InputManager();
      }

      return instance;
    }
  }]);

  return InputManager;
}();


InputManager.TOUCH_PHASE = {
  BEGAN: 0,
  MOVED: 1,
  ENDED: 2,
  CANCELED: 3
};

/***/ }),

/***/ "./libs/core/label.js":
/*!****************************!*\
  !*** ./libs/core/label.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Label; });
/* harmony import */ var _node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node */ "./libs/core/node.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var Label =
/*#__PURE__*/
function (_Node) {
  _inherits(Label, _Node);

  function Label(text, size, color) {
    var _this;

    _classCallCheck(this, Label);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Label).call(this));
    _this.__text__ = text || '';
    _this.__fontSize__ = size || 20;
    _this.__fontColor__ = color || sub.color(255, 255, 255, 255);
    _this.__fontFamily__ = 'Arial';

    _this._measure();

    return _this;
  }

  _createClass(Label, [{
    key: "setFontSize",
    value: function setFontSize(size) {
      this.__fontSize__ = size;

      this._measure();

      this._dispatchRenderEvent();
    }
  }, {
    key: "getFontSize",
    value: function getFontSize() {
      return this.__fontSize__;
    }
  }, {
    key: "setFontColor",
    value: function setFontColor(color) {
      this.__fontColor__ = color;

      this._dispatchRenderEvent();
    }
  }, {
    key: "getFontColor",
    value: function getFontColor() {
      return this.__fontColor__;
    }
  }, {
    key: "setText",
    value: function setText(text) {
      this.__text__ = text;

      this._measure();

      this._dispatchRenderEvent();
    }
  }, {
    key: "getText",
    value: function getText() {
      return this.__text__;
    }
  }, {
    key: "setContentSize",
    value: function setContentSize(size) {}
  }, {
    key: "_measure",
    value: function _measure() {
      sub.ctx.save();
      sub.ctx.font = this.__fontSize__ * sub.scaleFactor + 'px ' + this.__fontFamily__;
      var w = sub.ctx.measureText(this.__text__).width / sub.scaleFactor;
      var h = this.__fontSize__ * 1.2;
      this.__size__ = sub.size(w, h);
      sub.ctx.restore();
    }
  }, {
    key: "_draw",
    value: function _draw() {
      if (!this.__renderingContext__) return;
      if (!this.__visible__) return;

      this.__renderingContext__.save();

      var opacity = this.__opacity__ || this.__parent__ && this.__parent__.__opacity__ || 1;
      this.__renderingContext__.globalAlpha = opacity;

      var worldPos = this._getWorldPos();

      var posOnScreen = sub.world2ScreenPoint(worldPos);

      this.__renderingContext__.translate(posOnScreen.x, posOnScreen.y);

      this.__renderingContext__.rotate(this.__rotation__ * Math.PI / 180);

      this.__renderingContext__.scale(this.__scaleX__, this.__scaleY__);

      this.__renderingContext__.translate(-posOnScreen.x, -posOnScreen.y);

      var rect = this._getScreenRect();

      var x = rect.x;
      var y = rect.y;
      this.__renderingContext__.font = this.__fontSize__ * sub.scaleFactor + 'px ' + this.__fontFamily__;
      var a = this.__fontColor__.a && this.__fontColor__.a / 255 || 1;
      var style = 'rgba(' + this.__fontColor__.r + ',' + this.__fontColor__.g + ',' + this.__fontColor__.b + ',' + a + ')';
      this.__renderingContext__.fillStyle = style;
      this.__renderingContext__.textBaseline = 'top';

      this.__renderingContext__.fillText(this.__text__, x, y);

      if (this.__clip__) {
        this.__renderingContext__.beginPath();

        this.__renderingContext__.rect(x, y, width, height);

        this.__renderingContext__.clip();
      }

      for (var i = 0; i < this.__children__.length; i++) {
        this.__children__[i]._draw();
      }

      this.__renderingContext__.restore();
    }
  }]);

  return Label;
}(_node__WEBPACK_IMPORTED_MODULE_0__["default"]);



Label.prototype.text = function (text) {
  this.setText(text);
  return this;
};

Label.prototype.fontSize = function (size) {
  this.setFontSize(size);
  return this;
};

Label.prototype.fontColor = function (color) {
  this.setFontColor(color);
  return this;
};

/***/ }),

/***/ "./libs/core/loader.js":
/*!*****************************!*\
  !*** ./libs/core/loader.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Loader; });
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var instance = null;

var Loader =
/*#__PURE__*/
function () {
  function Loader() {
    _classCallCheck(this, Loader);

    if (instance) {
      throw new Error('sub.Loader is a singleton object, please use "sub.Loader.instance" instead.');
    }

    this._resMap = new Map();
  }

  _createClass(Loader, [{
    key: "load",
    value: function load(res, callback) {
      var _this = this;

      if (typeof res == 'string') {
        if (this.getImage(res)) {
          callback();
          return;
        }

        var img = wx.createImage();
        img.src = res;

        img.onload = function () {
          this._resMap.set(res, img);

          callback();
        }.bind(this);
      }

      if (Array.isArray(res)) {
        var _ret = function () {
          res = res.filter(function (value) {
            return !this.getImage(value);
          }.bind(_this));

          if (res.length == 0) {
            callback();
            return {
              v: void 0
            };
          }

          var loadCount = 0;

          var imgLoadCallback = function imgLoadCallback() {
            loadCount++;

            if (loadCount == res.length) {
              callback();
            }
          };

          var _loop = function _loop(i) {
            if (_this.getImage(res[i])) {
              imgLoadCallback();
              return "continue";
            }

            var src = res[i];
            var img = wx.createImage();
            img.src = src;

            img.onload = function () {
              this._resMap.set(src, img);

              imgLoadCallback();
            }.bind(_this);
          };

          for (var i = 0; i < res.length; i++) {
            var _ret2 = _loop(i);

            if (_ret2 === "continue") continue;
          }
        }();

        if (_typeof(_ret) === "object") return _ret.v;
      }
    }
  }, {
    key: "getImage",
    value: function getImage(path) {
      if (this._resMap.has(path)) return this._resMap.get(path);
      return null;
    }
  }], [{
    key: "instance",
    get: function get() {
      if (!instance) {
        instance = new Loader();
      }

      return instance;
    }
  }]);

  return Loader;
}();



/***/ }),

/***/ "./libs/core/message_mgr.js":
/*!**********************************!*\
  !*** ./libs/core/message_mgr.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return MessageManager; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var instance = null;

var MessageManager =
/*#__PURE__*/
function () {
  function MessageManager() {
    _classCallCheck(this, MessageManager);

    if (instance) {
      throw new Error('sub.MessageManager is a singleton object, please use "sub.MessageManager.instance" instead.');
    }

    this.__listeners__ = new Array();
    wx.onMessage(function (res) {
      this.__listeners__.forEach(function (listener) {
        listener(res);
      });
    }.bind(this));
  }

  _createClass(MessageManager, [{
    key: "addListener",
    value: function addListener(listener) {
      if (typeof listener != 'function') {
        throw new Error('Invaild argument.');
      }

      var index = this.__listeners__.indexOf(listener);

      if (index != -1) {
        return listener;
      }

      this.__listeners__.push(listener);

      return listener;
    }
  }, {
    key: "removeListener",
    value: function removeListener(listener) {
      if (typeof listener != 'function') {
        throw new Error('Invaild argument.');
      }

      var index = this.__listeners__.indexOf(listener);

      if (index == -1) {
        return;
      }

      this.__listeners__.splice(index, 1);
    }
  }], [{
    key: "instance",
    get: function get() {
      if (!instance) {
        instance = new MessageManager();
      }

      return instance;
    }
  }]);

  return MessageManager;
}();



/***/ }),

/***/ "./libs/core/node.js":
/*!***************************!*\
  !*** ./libs/core/node.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Node; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Node =
/*#__PURE__*/
function () {
  function Node(color) {
    _classCallCheck(this, Node);

    if (color) {
      var a = color.a && color.a / 255 || 1;
      this.__color__ = sub.color(color.r, color.g, color.b, a);
    }

    this.__renderingContext__ = undefined;
    this.__visible__ = true;
    this.__localPos__ = sub.p(0, 0);
    this.__anchor__ = sub.p(0, 0);
    this.__layout__ = undefined;
    this.__size__ = sub.size(0, 0);
    this.__scaleX__ = 1;
    this.__scaleY__ = 1;
    this.__rotation__ = 0;
    this.__parent__ = undefined;
    this.__children__ = new Array();
    this.__swallowTouches__ = false;
  }

  _createClass(Node, [{
    key: "setVisible",
    value: function setVisible(visible) {
      this.__visible__ = visible;

      this._dispatchRenderEvent();
    }
  }, {
    key: "isVisible",
    value: function isVisible() {
      return this.__visible__;
    }
  }, {
    key: "addChild",
    value: function addChild(child) {
      if (child.__parent__) {
        throw new Error('Error: Add child failed, the child node ettempts to add had aleardy bean added.');
      }

      child._setParent(this);

      this.__children__.push(child);

      this._dispatchRenderEvent();
    }
  }, {
    key: "removeChild",
    value: function removeChild(child) {
      if (child.__parent__ != this) {
        throw new Error('Error: Remove child failed, the child node attempts to remove is not parented by the current node.');
      }

      child._setParent(undefined);

      var idx = this.__children__.indexOf(child);

      this.__children__.splice(idx, 1);

      this._dispatchRenderEvent();
    }
  }, {
    key: "getChild",
    value: function getChild() {
      return this.__children__;
    }
  }, {
    key: "getParent",
    value: function getParent() {
      return this.__parent__;
    }
  }, {
    key: "setPosition",
    value: function setPosition(x, y) {
      this.__layout__ = undefined;

      if (y === undefined) {
        this.__localPos__ = x;
      } else {
        this.__localPos__ = sub.p(x, y);
      }

      this._dispatchRenderEvent();
    }
  }, {
    key: "getPosition",
    value: function getPosition() {
      return this.__localPos__;
    }
  }, {
    key: "getWorldPosition",
    value: function getWorldPosition() {
      return this._getWorldPos(true);
    }
  }, {
    key: "setLayout",
    value: function setLayout(rect) {
      this.__layout__ = rect;

      if (this.__parent__) {
        this._updatePosWithLayout(this.__layout__);

        this.__layout__ = undefined;
      }

      this._dispatchRenderEvent();
    }
  }, {
    key: "setScale",
    value: function setScale(x, y) {
      if (y === undefined) {
        this.__scaleX__ = this.__scaleY__ = x;
      } else {
        this.__scaleX__ = x;
        this.__scaleY__ = y;
      }

      this._dispatchRenderEvent();
    }
  }, {
    key: "getScale",
    value: function getScale() {
      return sub.p(this.__scaleX__, this.__scaleY__);
    }
  }, {
    key: "getWorldScale",
    value: function getWorldScale() {
      return this._getRealScale();
    }
  }, {
    key: "setRotation",
    value: function setRotation(rotation) {
      this.__rotation__ = rotation;

      this._dispatchRenderEvent();
    }
  }, {
    key: "getRotation",
    value: function getRotation() {
      return this.__rotation__;
    }
  }, {
    key: "getWorldRotation",
    value: function getWorldRotation() {
      return this._getRealRotation();
    }
  }, {
    key: "setAnchorPoint",
    value: function setAnchorPoint(x, y) {
      if (y === undefined) {
        this.__anchor__ = x;
      } else {
        this.__anchor__ = sub.p(x, y);
      }

      this._dispatchRenderEvent();
    }
  }, {
    key: "getAnchorPoint",
    value: function getAnchorPoint() {
      return this.__anchor__;
    }
  }, {
    key: "setContentSize",
    value: function setContentSize(w, h) {
      if (h === undefined) {
        this.__size__ = w;
      } else {
        this.__size__ = sub.size(w, h);
      }

      this._dispatchRenderEvent();
    }
  }, {
    key: "getContentSize",
    value: function getContentSize() {
      return this.__size__;
    }
  }, {
    key: "setOpacity",
    value: function setOpacity(opacity) {
      this.__opacity__ = opacity;

      this._dispatchRenderEvent();
    }
  }, {
    key: "getOpacity",
    value: function getOpacity() {
      return this.__opacity__;
    }
  }, {
    key: "enableClipMode",
    value: function enableClipMode() {
      this.__clip__ = true;

      this._dispatchRenderEvent();
    }
  }, {
    key: "setClipCornerRadius",
    value: function setClipCornerRadius(r) {
      this.__clipRadius__ = r;
    }
  }, {
    key: "setSwallowTouches",
    value: function setSwallowTouches(swallow) {
      this.__swallowTouches__ = swallow;
    }
  }, {
    key: "isSwallowTouches",
    value: function isSwallowTouches() {
      return this.__swallowTouches__;
    }
  }, {
    key: "containsPoint",
    value: function containsPoint(x, y) {
      var p;

      if (y === undefined) {
        p = x;
      } else {
        p = sub.p(x, y);
      }

      var screenPoint = sub.world2ScreenPoint(p);
      return this._containsScreenPoint(screenPoint.x, screenPoint.y);
    }
  }, {
    key: "_containsScreenPoint",
    value: function _containsScreenPoint(x, y) {
      var touchableRect = this._getTouchableRect();

      var worldPos = this._getWorldPos(true);

      var screenPos = sub.world2ScreenPoint(worldPos);
      var topLeft = sub.p(touchableRect.x, touchableRect.y);
      var topRight = sub.p(touchableRect.x + touchableRect.width, touchableRect.y);
      var bottomLeft = sub.p(touchableRect.x, touchableRect.y + touchableRect.height);
      var bottomRight = sub.p(touchableRect.x + touchableRect.width, touchableRect.y + touchableRect.height);

      var realRot = this._getRealRotation();

      if (realRot % 360 != 0) {
        topLeft = sub.pRotate(screenPos, topLeft, realRot);
        topRight = sub.pRotate(screenPos, topRight, realRot);
        bottomLeft = sub.pRotate(screenPos, bottomLeft, realRot);
        bottomRight = sub.pRotate(screenPos, bottomRight, realRot);
      }

      var minX = Math.min(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
      var maxX = Math.max(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
      var minY = Math.min(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);
      var maxY = Math.max(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);
      return x >= minX && x <= maxX && y >= minY && y <= maxY;
    }
  }, {
    key: "_draw",
    value: function _draw() {
      if (!this.__renderingContext__) return;
      if (!this.__visible__) return;

      this.__renderingContext__.save();

      var opacity = this.__opacity__ || this.__parent__ && this.__parent__.__opacity__ || 1;
      this.__renderingContext__.globalAlpha = opacity;

      var worldPos = this._getWorldPos();

      var posOnScreen = sub.world2ScreenPoint(worldPos);

      this.__renderingContext__.translate(posOnScreen.x, posOnScreen.y);

      this.__renderingContext__.rotate(this.__rotation__ * Math.PI / 180);

      this.__renderingContext__.scale(this.__scaleX__, this.__scaleY__);

      this.__renderingContext__.translate(-posOnScreen.x, -posOnScreen.y);

      var rect = this._getScreenRect();

      var x = rect.x;
      var y = rect.y;
      var width = rect.width;
      var height = rect.height;

      if (this.__color__) {
        this.__renderingContext__.beginPath();

        var style = 'rgba(' + this.__color__.r + ',' + this.__color__.g + ',' + this.__color__.b + ',' + this.__color__.a + ')';
        this.__renderingContext__.fillStyle = style;

        this.__renderingContext__.fillRect(x, y, width, height);
      }

      if (this.__clip__) {
        if (this.__clipRadius__) {
          this._drawRoundedRect(this.__renderingContext__, rect, this.__clipRadius__ * sub.scaleFactor);
        } else {
          this.__renderingContext__.beginPath();

          this.__renderingContext__.rect(x, y, width, height);
        }

        this.__renderingContext__.clip();
      }

      for (var i = 0; i < this.__children__.length; i++) {
        this.__children__[i]._draw();
      }

      this.__renderingContext__.restore();
    }
  }, {
    key: "_setParent",
    value: function _setParent(parent) {
      if (parent == undefined) {
        this.__parent__ = undefined;
        this.__renderingContext__ = undefined;
        return;
      }

      this.__parent__ = parent;
      this.__renderingContext__ = this.__parent__.__renderingContext__;

      var allChildren = this._getAllChildren();

      for (var i = 0; i < allChildren.length; i++) {
        allChildren[i].__renderingContext__ = this.__renderingContext__;
      }
    }
  }, {
    key: "_getWorldPos",
    value: function _getWorldPos(actualWoldPos) {
      if (!this.__parent__) return this.__localPos__;

      if (this.__layout__) {
        this._updatePosWithLayout(this.__layout__);

        this.__layout__ = undefined;
      }

      var parentRealScale = this.__parent__._getRealScale();

      var scaleX = actualWoldPos && parentRealScale.x || 1;
      var scaleY = actualWoldPos && parentRealScale.y || 1;

      var parentWorldPos = this.__parent__._getWorldPos(actualWoldPos);

      var parentAnchor = this.__parent__.getAnchorPoint();

      var parentSize = this.__parent__.getContentSize();

      var parentWidth = parentSize.width * scaleX;
      var parentHeight = parentSize.height * scaleY;
      var bottomLeftX = parentWorldPos.x - parentAnchor.x * parentWidth;
      var bottomLeftY = parentWorldPos.y - parentAnchor.y * parentHeight;
      var posX = this.__localPos__.x * scaleX;
      var posY = this.__localPos__.y * scaleY;
      var x = bottomLeftX + posX;
      var y = bottomLeftY + posY;
      var worldPos = sub.p(x, y);

      if (actualWoldPos) {
        var parentRealRot = this.__parent__._getRealRotation();

        var origin = sub.world2ScreenPoint(parentWorldPos);
        var target = sub.world2ScreenPoint(worldPos);
        worldPos = sub.pRotate(origin, target, parentRealRot);
        worldPos = sub.screen2WorldPoint(worldPos);
      }

      return worldPos;
    }
  }, {
    key: "_updatePosWithLayout",
    value: function _updatePosWithLayout(layout) {
      var parentSize = this.__parent__.getContentSize();

      var layoutX = layout.x;
      var layoutY = layout.y;
      var offsetX = layout.width;
      var offsetY = layout.height;
      var x = parentSize.width * layoutX + offsetX;
      var y = parentSize.height * layoutY + offsetY;
      this.__localPos__ = sub.p(x, y);
    }
  }, {
    key: "_getScreenRect",
    value: function _getScreenRect(realScale) {
      var scaleX = realScale && Math.abs(realScale.x) || 1;
      var scaleY = realScale && Math.abs(realScale.y) || 1;

      var worldPos = this._getWorldPos(realScale !== undefined);

      var posOnScreen = sub.world2ScreenPoint(worldPos);
      var sizeOnScreen = sub.world2ScreenSize(this.__size__);
      var anchorX = realScale && realScale.x < 0 ? 1 - this.__anchor__.x : this.__anchor__.x;
      var anchorY = realScale && realScale.y < 0 ? this.__anchor__.y : 1 - this.__anchor__.y;
      var x = posOnScreen.x - anchorX * sizeOnScreen.width * scaleX;
      var y = posOnScreen.y - anchorY * sizeOnScreen.height * scaleY;
      var w = sizeOnScreen.width * scaleX;
      var h = sizeOnScreen.height * scaleY;
      return sub.rect(x, y, w, h);
    }
  }, {
    key: "_getTouchableRect",
    value: function _getTouchableRect() {
      var realScale = this._getRealScale();

      return this._getScreenRect(realScale);
    }
  }, {
    key: "_getRealScale",
    value: function _getRealScale() {
      if (!this.__parent__) return sub.p(this.__scaleX__, this.__scaleY__);

      var parentRealScale = this.__parent__._getRealScale();

      return sub.p(parentRealScale.x * this.__scaleX__, parentRealScale.y * this.__scaleY__);
    }
  }, {
    key: "_getRealRotation",
    value: function _getRealRotation() {
      if (!this.__parent__) return this.__rotation__;

      var parentRealRot = this.__parent__._getRealRotation();

      return this.__rotation__ + parentRealRot;
    }
  }, {
    key: "_dispatchRenderEvent",
    value: function _dispatchRenderEvent() {
      if (!this.__parent__ && this.setDirty) {
        this.setDirty();
      } else if (this.__parent__) {
        this.__parent__._dispatchRenderEvent();
      }
    }
  }, {
    key: "_getAllChildren",
    value: function _getAllChildren(result) {
      var allChildren = result || new Array();

      for (var i = 0; i < this.__children__.length; i++) {
        var child = this.__children__[i];
        allChildren.push(child);

        child._getAllChildren(allChildren);
      }

      return allChildren;
    }
  }, {
    key: "_getClippingParents",
    value: function _getClippingParents(result) {
      var parents = result || new Array();

      if (!this.__parent__) {
        return parents;
      }

      if (this.__parent__.__clip__) {
        parents.push(this.__parent__);
      }

      this.__parent__._getClippingParents(parents);

      return parents;
    }
  }, {
    key: "_drawRoundedRect",
    value: function _drawRoundedRect(ctx, rect, r) {
      var ptA = sub.p(rect.x + r, rect.y);
      var ptB = sub.p(rect.x + rect.width, rect.y);
      var ptC = sub.p(rect.x + rect.width, rect.y + rect.height);
      var ptD = sub.p(rect.x, rect.y + rect.height);
      var ptE = sub.p(rect.x, rect.y);
      ctx.beginPath();
      ctx.moveTo(ptA.x, ptA.y);
      ctx.arcTo(ptB.x, ptB.y, ptC.x, ptC.y, r);
      ctx.arcTo(ptC.x, ptC.y, ptD.x, ptD.y, r);
      ctx.arcTo(ptD.x, ptD.y, ptE.x, ptE.y, r);
      ctx.arcTo(ptE.x, ptE.y, ptA.x, ptA.y, r);
    }
  }]);

  return Node;
}();



Node.prototype.addTo = function (parent) {
  parent.addChild(this);
  return this;
};

Node.prototype.move = function (x, y) {
  this.setPosition(x, y);
  return this;
};

Node.prototype.anchor = function (x, y) {
  this.setAnchorPoint(x, y);
  return this;
};

Node.prototype.layout = function (p, offsetX, offsetY) {
  var offset = sub.p(0, 0);

  if (offsetX != undefined && offsetY != undefined) {
    offset.x = offsetX;
    offset.y = offsetY;
  } else if (offsetX != undefined && offsetY == undefined) {
    offset = offsetX;
  }

  var rect = sub.rect(p.x, p.y, offset.x, offset.y);
  this.setLayout(rect);
  return this;
};

Node.prototype.scale = function (x, y) {
  this.setScale(x, y);
  return this;
};

Node.prototype.size = function (w, h) {
  this.setContentSize(w, h);
  return this;
};

Node.prototype.rotate = function (rotation) {
  this.setRotation(rotation);
  return this;
};

Node.prototype.opacity = function (opacity) {
  this.setOpacity(opacity);
  return this;
};

Node.prototype.visible = function (visible) {
  this.setVisible(visible);
  return this;
};

Node.prototype.clipping = function () {
  this.enableClipMode();
  return this;
};

Node.prototype.removeSelf = function () {
  if (!this.__parent__) {
    return;
  }

  this.__parent__.removeChild(this);
};

/***/ }),

/***/ "./libs/core/scene.js":
/*!****************************!*\
  !*** ./libs/core/scene.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Scene; });
/* harmony import */ var _node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node */ "./libs/core/node.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var Scene =
/*#__PURE__*/
function (_Node) {
  _inherits(Scene, _Node);

  function Scene() {
    var _this;

    _classCallCheck(this, Scene);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Scene).call(this));
    _this.__dirty__ = true;
    _this.__renderingContext__ = sub.ctx;

    _this.setContentSize(sub.display.width, sub.display.height);

    _this.enableMessageEvents();

    return _this;
  }

  _createClass(Scene, [{
    key: "setDirty",
    value: function setDirty() {
      this.__dirty__ = true;
    }
  }, {
    key: "clearScreen",
    value: function clearScreen() {
      this.__renderingContext__.clearRect(0, 0, sub.canvas.width, sub.canvas.height);
    }
  }, {
    key: "enableScheduler",
    value: function enableScheduler() {
      this.__scheduleHander__ = sub.Ticker.instance.tick(function (dt) {
        if (this.update) this.update(dt);

        var allChildren = this._getAllChildren();

        for (var i = 0; i < allChildren.length; i++) {
          var child = allChildren[i];
          if (child.update) child.update(dt);
        }

        if (this.__dirty__) {
          this._render();

          this.__dirty__ = false;
        }
      }.bind(this));
    }
  }, {
    key: "disableScheduler",
    value: function disableScheduler() {
      if (!this.__scheduleHander__) return;
      sub.Ticker.instance.untick(this.__scheduleHander__);
      this.__scheduleHander__ = null;
    }
  }, {
    key: "enableTouchEvents",
    value: function enableTouchEvents() {
      if (this.__touchEventListener__) {
        return;
      }

      this.__touchEventListener__ = sub.InputManager.instance.addListener(this._dispatchTouchEvent.bind(this));
    }
  }, {
    key: "disableTouchEvents",
    value: function disableTouchEvents() {
      if (!this.__touchEventListener__) return;
      sub.InputManager.instance.removeListener(this.__touchEventListener__);
      this.__touchEventListener__ = null;
    }
  }, {
    key: "enableMessageEvents",
    value: function enableMessageEvents() {
      if (this.__messageEventListener__) {
        return;
      }

      this.__messageEventListener__ = sub.MessageManager.instance.addListener(this._dispatchMessageEvent.bind(this));
    }
  }, {
    key: "disableMessageEvents",
    value: function disableMessageEvents() {
      if (!this.__messageEventListener__) return;
      sub.MessageManager.instance.removeListener(this.__messageEventListener__);
      this.__messageEventListener__ = null;
    } // 视图左上角与界面左上角的距离，世界坐标

  }, {
    key: "setTouchOffset",
    value: function setTouchOffset(offset) {
      this._touchOffset = offset;
    }
  }, {
    key: "_convertTouchData",
    value: function _convertTouchData(touch) {
      if (!this._touchOffset) {
        return;
      }

      touch.worldPos.x = touch.worldPos.x - this._touchOffset.x;
      touch.worldPos.y = touch.worldPos.y + this._touchOffset.y;
      touch.screenPos = sub.world2ScreenPoint(touch.worldPos);
    }
  }, {
    key: "_dispatchTouchEvent",
    value: function _dispatchTouchEvent(touch) {
      this._convertTouchData(touch);

      var phase = touch.phase;

      if (phase == sub.InputManager.TOUCH_PHASE.BEGAN) {
        this.__blockOrder__ = 0;
      }

      var allChildren = this._getAllChildren();

      for (var i = allChildren.length - 1; i >= this.__blockOrder__; i--) {
        var child = allChildren[i];

        if (!child.onTouchBegan) {
          continue;
        }

        var screenPos = touch.screenPos;
        var worldPos = touch.worldPos;

        var containsPoint = child._containsScreenPoint(screenPos.x, screenPos.y);

        var clippingParents = child._getClippingParents();

        var clipped = false;

        for (var j = 0; j < clippingParents.length; j++) {
          var p = clippingParents[j];

          if (!p.containsPoint(worldPos)) {
            clipped = true;
            break;
          }
        }

        switch (phase) {
          case sub.InputManager.TOUCH_PHASE.BEGAN:
            if (clipped) continue;
            if (child.onTouchBegan) child.onTouchBegan(touch);
            break;

          case sub.InputManager.TOUCH_PHASE.MOVED:
            if (clipped) {
              child.onTouchCanceled && child.onTouchCanceled(touch);
              continue;
            }

            if (child.onTouchMoved) child.onTouchMoved(touch);
            break;

          case sub.InputManager.TOUCH_PHASE.ENDED:
            if (clipped) continue;
            if (child.onTouchEnded) child.onTouchEnded(touch);
            break;

          case sub.InputManager.TOUCH_PHASE.CANCELED:
            if (clipped) continue;
            if (child.onTouchCanceled) child.onTouchCanceled(touch);
            break;
        }

        if (containsPoint && child.isSwallowTouches() && phase == sub.InputManager.TOUCH_PHASE.BEGAN) {
          this.__blockOrder__ = i;
          break;
        }
      }
    }
  }, {
    key: "_dispatchMessageEvent",
    value: function _dispatchMessageEvent(res) {
      if (this.onMessage) {
        this.onMessage(res);
      }

      var allChildren = this._getAllChildren();

      allChildren.forEach(function (child) {
        if (child.onMessage) {
          child.onMessage(res);
        }
      });
    }
  }, {
    key: "_render",
    value: function _render() {
      this.__renderingContext__.clearRect(0, 0, sub.canvas.width, sub.canvas.height);

      this.__renderingContext__.globalAlpha = 0;

      this._draw();
    }
  }]);

  return Scene;
}(_node__WEBPACK_IMPORTED_MODULE_0__["default"]);



/***/ }),

/***/ "./libs/core/sprite.js":
/*!*****************************!*\
  !*** ./libs/core/sprite.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Sprite; });
/* harmony import */ var _node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node */ "./libs/core/node.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }


var RENDER_MODE = {
  normal: 0,
  sliced: 1
};

var Sprite =
/*#__PURE__*/
function (_Node) {
  _inherits(Sprite, _Node);

  function Sprite(path) {
    var _this;

    _classCallCheck(this, Sprite);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Sprite).call(this));
    _this.__imgLoaded__ = false;
    _this.__mode__ = RENDER_MODE.normal;

    if (path) {
      _this.loadImage(path);
    }

    return _this;
  }

  _createClass(Sprite, [{
    key: "loadImage",
    value: function loadImage(path) {
      this.__img__ = sub.Loader.instance.getImage(path);

      if (this.__img__) {
        this.__size__ = sub.size(this.__img__.width, this.__img__.height);
        this.__imgLoaded__ = true;
      } else {
        sub.Loader.instance.load(path, function () {
          this.__img__ = sub.Loader.instance.getImage(path);

          if (this.__size__.width == 0 && this.__size__.height == 0) {
            this.__size__ = sub.size(this.__img__.width, this.__img__.height);
          }

          if (this.__mode__ == RENDER_MODE.sliced && !this.__stretchRect__) {
            var x = (this.__img__.width - 2) / 2;
            var y = (this.__img__.height - 2) / 2;
            this.__stretchRect__ = sub.rect(x, y, 2, 2);
          }

          this.__imgLoaded__ = true;

          if (this.onload) {
            this.onload();
          }

          this._dispatchRenderEvent();
        }.bind(this));
      }
    }
  }, {
    key: "setContentSize",
    value: function setContentSize(w, h) {
      if (this.__mode__ != RENDER_MODE.sliced) {
        return;
      }

      var size = undefined;

      if (h === undefined) {
        size = w;
      } else {
        size = sub.size(w, h);
      }

      this.__size__ = size;

      this._dispatchRenderEvent();
    }
  }, {
    key: "setScale9Enabled",
    value: function setScale9Enabled(enabled) {
      this.__mode__ = enabled ? RENDER_MODE.sliced : RENDER_MODE.normal;
      if (!this.__img__) return;

      if (this.__mode__ == RENDER_MODE.sliced && !this.__stretchRect__) {
        var x = (this.__img__.width - 2) / 2;
        var y = (this.__img__.height - 2) / 2;
        this.__stretchRect__ = sub.rect(x, y, 2, 2);
      }

      this._dispatchRenderEvent();
    }
    /**
     * [setCapInserts description]
     * @param {rect} rect = sub.rect(x, y, w, h), 参考下图：
     *   -------------------
     *  |     |       |     |
     *  |     y       |     |
     *  |--x--|---w---|-----|
     *  |     |       |     |
     *  |     h       |     |
     *  |-----|-------|-----|
     *  |     |       |     |
     *  |     |       |     |
     *   -------------------
     */

  }, {
    key: "setCapInserts",
    value: function setCapInserts(rect) {
      this.__stretchRect__ = rect;

      this._dispatchRenderEvent();
    }
  }, {
    key: "isImgLoaded",
    value: function isImgLoaded() {
      return this.__imgLoaded__;
    }
  }, {
    key: "_draw",
    value: function _draw() {
      if (!this.__renderingContext__) return;
      if (!this.__img__) return;
      if (!this.__visible__) return;

      this.__renderingContext__.save();

      var opacity = this.__opacity__ || this.__parent__ && this.__parent__.__opacity__ || 1;
      this.__renderingContext__.globalAlpha = opacity;

      var worldPos = this._getWorldPos();

      var posOnScreen = sub.world2ScreenPoint(worldPos);

      this.__renderingContext__.translate(posOnScreen.x, posOnScreen.y);

      this.__renderingContext__.rotate(this.__rotation__ * Math.PI / 180);

      this.__renderingContext__.scale(this.__scaleX__, this.__scaleY__);

      this.__renderingContext__.translate(-posOnScreen.x, -posOnScreen.y);

      var rect = this._getScreenRect();

      var x = rect.x;
      var y = rect.y;
      var width = rect.width;
      var height = rect.height;

      if (this.__mode__ == RENDER_MODE.normal) {
        this.__renderingContext__.drawImage(this.__img__, x, y, width, height);
      } else if (this.__mode__ == RENDER_MODE.sliced) {
        this._drawWithSliceMode();
      }

      if (this.__clip__) {
        this.__renderingContext__.beginPath();

        this.__renderingContext__.rect(x, y, width, height);

        this.__renderingContext__.clip();
      }

      for (var i = 0; i < this.__children__.length; i++) {
        this.__children__[i]._draw();
      }

      this.__renderingContext__.restore();
    }
  }, {
    key: "_drawWithSliceMode",
    value: function _drawWithSliceMode() {
      if (this.__mode__ != RENDER_MODE.sliced) {
        return;
      }

      if (!this.__stretchRect__) {
        return;
      }

      var screenRect = this._getScreenRect();

      var stretchRect = this.__stretchRect__; //top left

      var sx1 = 0;
      var sy1 = 0;
      var swidth1 = stretchRect.x;
      var sheight1 = stretchRect.y;
      var x1 = screenRect.x;
      var y1 = screenRect.y;
      var width1 = swidth1 * sub.scaleFactor;
      var height1 = stretchRect.y * sub.scaleFactor;

      this.__renderingContext__.drawImage(this.__img__, sx1, sy1, swidth1, sheight1, x1, y1, width1, height1); // top right


      var sx2 = stretchRect.x + stretchRect.width;
      var sy2 = 0;
      var swidth2 = this.__img__.width - stretchRect.x - stretchRect.width;
      var sheight2 = stretchRect.y;
      var x2 = screenRect.x + (screenRect.width - swidth2 * sub.scaleFactor);
      var y2 = screenRect.y;
      var width2 = swidth2 * sub.scaleFactor;
      var height2 = stretchRect.y * sub.scaleFactor;

      this.__renderingContext__.drawImage(this.__img__, sx2, sy2, swidth2, sheight2, x2, y2, width2, height2); // top center


      var sx3 = stretchRect.x;
      var sy3 = 0;
      var swidth3 = stretchRect.width;
      var sheight3 = stretchRect.y;
      var x3 = screenRect.x + stretchRect.x * sub.scaleFactor;
      var y3 = screenRect.y;
      var width3 = screenRect.width - (swidth1 + swidth2) * sub.scaleFactor;
      var height3 = stretchRect.y * sub.scaleFactor;

      this.__renderingContext__.drawImage(this.__img__, sx3, sy3, swidth3, sheight3, x3, y3, width3, height3); // bottom left


      var sx4 = 0;
      var sy4 = stretchRect.y + stretchRect.height;
      var swidth4 = stretchRect.x;
      var sheight4 = this.__img__.height - stretchRect.y - stretchRect.height;
      var x4 = screenRect.x;
      var y4 = screenRect.y + (screenRect.height - sheight4 * sub.scaleFactor);
      var width4 = stretchRect.x * sub.scaleFactor;
      var height4 = sheight4 * sub.scaleFactor;

      this.__renderingContext__.drawImage(this.__img__, sx4, sy4, swidth4, sheight4, x4, y4, width4, height4); // bottom right


      var sx5 = stretchRect.x + stretchRect.width;
      var sy5 = stretchRect.y + stretchRect.height;
      var swidth5 = this.__img__.width - stretchRect.x - stretchRect.width;
      var sheight5 = this.__img__.height - stretchRect.y - stretchRect.height;
      var x5 = screenRect.x + (screenRect.width - swidth5 * sub.scaleFactor);
      var y5 = screenRect.y + (screenRect.height - sheight5 * sub.scaleFactor);
      var width5 = swidth5 * sub.scaleFactor;
      var height5 = sheight5 * sub.scaleFactor;

      this.__renderingContext__.drawImage(this.__img__, sx5, sy5, swidth5, sheight5, x5, y5, width5, height5); // bottom center


      var sx6 = stretchRect.x;
      var sy6 = stretchRect.y + stretchRect.height;
      var swidth6 = stretchRect.width;
      var sheight6 = this.__img__.height - stretchRect.y - stretchRect.height;
      var x6 = screenRect.x + stretchRect.x * sub.scaleFactor;
      var y6 = screenRect.y + (screenRect.height - sheight6 * sub.scaleFactor);
      var width6 = screenRect.width - (swidth4 + swidth5) * sub.scaleFactor;
      var height6 = sheight6 * sub.scaleFactor;

      this.__renderingContext__.drawImage(this.__img__, sx6, sy6, swidth6, sheight6, x6, y6, width6, height6); // center left


      var sx7 = 0;
      var sy7 = stretchRect.y;
      var swidth7 = stretchRect.x;
      var sheight7 = stretchRect.height;
      var x7 = screenRect.x;
      var y7 = screenRect.y + stretchRect.y * sub.scaleFactor;
      var width7 = swidth7 * sub.scaleFactor;
      var height7 = screenRect.height - (sheight1 + sheight4) * sub.scaleFactor;

      this.__renderingContext__.drawImage(this.__img__, sx7, sy7, swidth7, sheight7, x7, y7, width7, height7); // center right


      var sx8 = stretchRect.x + stretchRect.width;
      var sy8 = stretchRect.y;
      var swidth8 = this.__img__.width - stretchRect.x - stretchRect.width;
      var sheight8 = stretchRect.height;
      var x8 = screenRect.x + (screenRect.width - swidth8 * sub.scaleFactor);
      var y8 = screenRect.y + stretchRect.y * sub.scaleFactor;
      var width8 = swidth8 * sub.scaleFactor;
      var height8 = screenRect.height - (sheight1 + sheight4) * sub.scaleFactor;

      this.__renderingContext__.drawImage(this.__img__, sx8, sy8, swidth8, sheight8, x8, y8, width8, height8); // center


      var sx9 = stretchRect.x;
      var sy9 = stretchRect.y;
      var swidth9 = stretchRect.width;
      var sheight9 = stretchRect.height;
      var x9 = screenRect.x + sx9 * sub.scaleFactor;
      var y9 = screenRect.y + sy9 * sub.scaleFactor;
      var width9 = screenRect.width - (swidth7 + swidth8) * sub.scaleFactor;
      var height9 = height8;

      this.__renderingContext__.drawImage(this.__img__, sx9, sy9, swidth9, sheight9, x9, y9, width9, height9);
    }
  }]);

  return Sprite;
}(_node__WEBPACK_IMPORTED_MODULE_0__["default"]);



/***/ }),

/***/ "./libs/core/ticker.js":
/*!*****************************!*\
  !*** ./libs/core/ticker.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Ticker; });
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var instance = null;

var Ticker =
/*#__PURE__*/
function () {
  function Ticker() {
    _classCallCheck(this, Ticker);

    if (instance) {
      throw new Error('sub.Ticker is a singleton object, please use "sub.Ticker.instance" instead.');
    }

    this.__now__ = 0;
    this.__last__ = 0;
    this.__dt__ = 0;
    this.__linteners__ = new Array();

    this._start();
  }

  _createClass(Ticker, [{
    key: "tick",
    value: function tick(listener) {
      if (!_typeof(listener) == 'function') {
        throw new Error('Invaild argument.');
      }

      var index = this.__linteners__.indexOf(listener);

      if (index != -1) {
        return listener;
      }

      this.__linteners__.push(listener);

      return listener;
    }
  }, {
    key: "untick",
    value: function untick(listener) {
      if (!_typeof(listener) == 'function') {
        throw new Error('Invaild argument.');
      }

      var index = this.__linteners__.indexOf(listener);

      if (index == -1) {
        return;
      }

      this.__linteners__.splice(index, 1);
    }
  }, {
    key: "_start",
    value: function _start() {
      this.__last__ = new Date().getTime();
      requestAnimationFrame(this._loop.bind(this));
    }
  }, {
    key: "_loop",
    value: function _loop() {
      var _this = this;

      this.__now__ = new Date().getTime();
      this.__dt__ = (this.__now__ - this.__last__) / 1000;

      this.__linteners__.forEach(function (listener) {
        listener(_this.__dt__);
      });

      this.__last__ = this.__now__;
      requestAnimationFrame(this._loop.bind(this));
    }
  }], [{
    key: "instance",
    get: function get() {
      if (!instance) {
        instance = new Ticker();
      }

      return instance;
    }
  }]);

  return Ticker;
}();



/***/ }),

/***/ "./libs/widget/button.js":
/*!*******************************!*\
  !*** ./libs/widget/button.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Button; });
/* harmony import */ var _core_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/node */ "./libs/core/node.js");
/* harmony import */ var _core_sprite__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/sprite */ "./libs/core/sprite.js");
/* harmony import */ var _core_label__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/label */ "./libs/core/label.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var Button =
/*#__PURE__*/
function (_Node) {
  _inherits(Button, _Node);

  function Button() {
    var _this;

    _classCallCheck(this, Button);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Button).call(this, sub.color(255, 255, 255, 255)));

    _this.setContentSize(200, 60);

    _this.setAnchorPoint(0.5, 0.5);

    _this.setSwallowTouches(true);

    _this.__image__ = new _core_sprite__WEBPACK_IMPORTED_MODULE_1__["default"]();

    _this.__image__.addTo(_assertThisInitialized(_this));

    _this.__label__ = new _core_label__WEBPACK_IMPORTED_MODULE_2__["default"]('Button', 18);

    _this.__label__.addTo(_assertThisInitialized(_this));

    _this.__label__.anchor(0.5, 0.5);

    _this.__label__.fontColor(sub.color(50, 50, 50, 255));

    _this.__label__.layout(sub.p(0.5, 0.5));

    return _this;
  }

  _createClass(Button, [{
    key: "setImage",
    value: function setImage(path) {
      this.__image__.loadImage(path);

      var initWithImage = function () {
        this.__color__ = null;

        this.__image__.anchor(0.5, 0.5);

        this.__image__.size(this.__size__);

        this.__image__.layout(sub.p(0.5, 0.5));

        var size = this.__image__.getContentSize();

        this.setContentSize(size);

        this.__label__.layout(sub.p(0.5, 0.5));
      }.bind(this);

      if (this.__image__.isImgLoaded()) {
        initWithImage();
        return this;
      }

      this.__image__.onload = function () {
        initWithImage();
      }.bind(this);

      return this;
    }
  }, {
    key: "setText",
    value: function setText(text) {
      this.__label__.text(text);

      return this;
    }
  }, {
    key: "setTextSize",
    value: function setTextSize(size) {
      this.__label__.fontSize(size);

      return this;
    }
  }, {
    key: "setTextColor",
    value: function setTextColor(color) {
      this.__label__.fontColor(color);

      return this;
    }
  }, {
    key: "setTextVisible",
    value: function setTextVisible(visible) {
      this.__label__.visible(visible);

      return this;
    }
  }, {
    key: "setBtnImageScale9Enabled",
    value: function setBtnImageScale9Enabled(isEnabled) {
      this.__image__.setScale9Enabled(isEnabled);

      return this;
    }
  }, {
    key: "setContentSize",
    value: function setContentSize(w, h) {
      if (!h) {
        this.__size__ = w;
      } else {
        this.__size__ = sub.size(w, h);
      }

      if (this.__image__) {
        this.__image__.size(w, h);

        this.__image__.layout(sub.p(0.5, 0.5));
      }

      if (this.__label__) this.__label__.layout(sub.p(0.5, 0.5));

      this._dispatchRenderEvent();
    }
  }, {
    key: "onTouchBegan",
    value: function onTouchBegan(touch) {
      var touched = this.containsPoint(touch.worldPos);
      var visible = this.isVisible();
      this.__passing__ = touched && visible;
      this.__moveDistance__ = 0;
      this.__firstTouchPos__ = touch.screenPos;

      if (this.__passing__) {
        this.__originScale__ = this.getScale();
        this.scale(this.__originScale__.x * 0.9, this.__originScale__.y * 0.9);
      }
    }
  }, {
    key: "onTouchMoved",
    value: function onTouchMoved(touch) {
      if (!this.__passing__) return;
      var curTouchPos = touch.screenPos;
      var distance = sub.pGetDistance(this.__firstTouchPos__, curTouchPos);
      this.__firstTouchPos__ = curTouchPos;
      this.__moveDistance__ += distance;

      if (!this.containsPoint(touch.worldPos)) {
        this.scale(this.__originScale__.x, this.__originScale__.y);
      }
    }
  }, {
    key: "onTouchEnded",
    value: function onTouchEnded(touch) {
      if (!this.__passing__) return;
      this.scale(this.__originScale__.x, this.__originScale__.y);

      if (this.__moveDistance__ > 20) {
        return;
      }

      if (!this.containsPoint(touch.worldPos)) {
        return;
      }

      if (this.onClick) this.onClick(touch);
    }
  }, {
    key: "onTouchCanceled",
    value: function onTouchCanceled(touch) {
      this.onTouchEnded(touch);
    }
  }]);

  return Button;
}(_core_node__WEBPACK_IMPORTED_MODULE_0__["default"]);



Button.prototype.setClickCallback = function (cb) {
  this.onClick = cb;
  return this;
};

/***/ }),

/***/ "./libs/widget/font_label.js":
/*!***********************************!*\
  !*** ./libs/widget/font_label.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return FontLabel; });
/* harmony import */ var _core_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/node */ "./libs/core/node.js");
/* harmony import */ var _core_sprite__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/sprite */ "./libs/core/sprite.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var FontLabel =
/*#__PURE__*/
function (_Node) {
  _inherits(FontLabel, _Node);

  function FontLabel(txt, config, space) {
    var _this;

    _classCallCheck(this, FontLabel);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FontLabel).call(this));
    _this.__config__ = config;
    _this.__contentStr__ = txt || "";
    _this.__spriteArr__ = [];
    _this.__space__ = space || 0;

    _this._updateNode();

    return _this;
  }

  _createClass(FontLabel, [{
    key: "setText",
    value: function setText(txt) {
      this.__contentStr__ = txt;

      this._updateNode();
    } // ------------------ 私有接口 ------------------

  }, {
    key: "_updateNode",
    value: function _updateNode() {
      this._clearSpriteArr();

      var width = 0;
      var height = 0;

      for (var i = 0; i < this.__contentStr__.length; i++) {
        var imgKey = this.__config__[this.__contentStr__[i]];

        if (!imgKey) {
          console.warn("=========FontLabel::_updateNode unsupport char:", this.__contentStr__[i]);
          continue;
        }

        var imgChar = new _core_sprite__WEBPACK_IMPORTED_MODULE_1__["default"](imgKey).addTo(this).anchor(0, 0.5);

        this.__spriteArr__.push(imgChar);

        var imgSize = imgChar.getContentSize();
        height = Math.max(imgSize.height, height);
        width = width + imgSize.width + this.__space__;
      }

      if (width > 0) {
        width = width - this.__space__;
      }

      this.setContentSize(width, height);

      this._layoutSpriteArr();
    }
  }, {
    key: "_clearSpriteArr",
    value: function _clearSpriteArr() {
      for (var i = 0; i < this.__spriteArr__.length; i++) {
        this.__spriteArr__[i].removeSelf();
      }

      this.__spriteArr__ = [];
    }
  }, {
    key: "_layoutSpriteArr",
    value: function _layoutSpriteArr() {
      var offsetX = 0;

      for (var i = 0; i < this.__spriteArr__.length; i++) {
        this.__spriteArr__[i].layout(sub.p(0, 0.5), sub.p(offsetX, 0));

        var imgWidth = this.__spriteArr__[i].getContentSize().width;

        offsetX = offsetX + imgWidth + this.__space__;
      }
    }
  }]);

  return FontLabel;
}(_core_node__WEBPACK_IMPORTED_MODULE_0__["default"]);



/***/ }),

/***/ "./libs/widget/rankview.js":
/*!*********************************!*\
  !*** ./libs/widget/rankview.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return RankView; });
/* harmony import */ var _scrollview__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scrollview */ "./libs/widget/scrollview.js");
/* harmony import */ var _core_node__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/node */ "./libs/core/node.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var RankView =
/*#__PURE__*/
function (_ScrollView) {
  _inherits(RankView, _ScrollView);

  // config 数据格式：
  // let config = {
  //     data : [],
  //     cellSize: sub.size(300, 80),
  //     onCreateCell : function() {
  //         return new TestCell();
  //     },
  //     onUpdateCell : function(cell, data) {
  //         cell.updateView(data)
  //     }
  // }
  function RankView(config) {
    var _this;

    _classCallCheck(this, RankView);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RankView).call(this));
    _this.__pool__ = [];
    _this.__cellPos__ = {};
    _this.__config__ = config;
    _this.__data__ = config.data;

    _this._reload();

    return _this;
  } // 设置排行榜数据


  _createClass(RankView, [{
    key: "setData",
    value: function setData(data) {
      this.__data__ = data;

      this._reload();
    } // 刷新

  }, {
    key: "_reload",
    value: function _reload() {
      this.__pool__ = [];
      var container = new _core_node__WEBPACK_IMPORTED_MODULE_1__["default"]();
      var cell_size = this.__config__.cellSize;
      var count = this.__data__.length;

      if (this.__direction__ == _scrollview__WEBPACK_IMPORTED_MODULE_0__["default"].VERTICAL) {
        var height = count * cell_size.height;

        if (height < this.getContentSize().height) {
          height = this.getContentSize().height;
        }

        container.size(this.getContentSize().width, height);
      } else if (this.__direction__ == _scrollview__WEBPACK_IMPORTED_MODULE_0__["default"].HORIZONTAL) {
        var width = count * cell_size.width;

        if (width < this.getContentSize().width) {
          width = this.getContentSize().width;
        }

        container.size(width, this.getContentSize().height);
      }

      this.setContainer(container);
      container.anchor(sub.p(0, 1));
      container.layout(sub.p(0, 1));

      this._generateCellData();

      this._updateCells();
    } // 生成所有cell的位置信息

  }, {
    key: "_generateCellData",
    value: function _generateCellData() {
      var count = this.__data__.length;
      var cell_size = this.__config__.cellSize;
      var container_size = this.getContainer().getContentSize();
      var cell_offset_x = this.__config__.cellOffsetX || 0;
      this.__cellPos__ = [];

      for (var index = 0; index < count; index++) {
        var x = cell_offset_x;
        var y = 0;

        if (this.__direction__ == _scrollview__WEBPACK_IMPORTED_MODULE_0__["default"].VERTICAL) {
          y = container_size.height - index * cell_size.height;
        } else if (this.__direction__ == _scrollview__WEBPACK_IMPORTED_MODULE_0__["default"].HORIZONTAL) {
          x = index * cell_size.width;
          y = this.getContentSize().height;
        }

        this.__cellPos__[index] = sub.p(x, y);
      }
    } // 计算需要显示的cellindex array

  }, {
    key: "_calcDisplayIndex",
    value: function _calcDisplayIndex() {
      var container = this.getContainer();
      var container_pos = container.getPosition();
      var container_size = container.getContentSize();
      var tabelview_size = this.getContentSize();
      var visibleCells = [];

      if (this.__direction__ == _scrollview__WEBPACK_IMPORTED_MODULE_0__["default"].VERTICAL) {
        for (var index in this.__cellPos__) {
          var pos = this.__cellPos__[index];
          var child_size = this.__config__.cellSize;
          var offsety = container_pos.y - container_size.height;
          var rely = pos.y - tabelview_size.height + offsety + tabelview_size.height;

          if (rely >= 0 && rely <= tabelview_size.height + child_size.height) {
            visibleCells.push(index);
          }
        }
      } else if (this.__direction__ == _scrollview__WEBPACK_IMPORTED_MODULE_0__["default"].HORIZONTAL) {
        for (var _index in this.__cellPos__) {
          var _pos = this.__cellPos__[_index];
          var _child_size = this.__config__.cellSize;
          var relx = _pos.x + container_pos.x;

          if (relx >= -_child_size.width && relx <= tabelview_size.width) {
            visibleCells.push(_index);
          }
        }
      }

      return visibleCells;
    } // 回收cellindex位置的cell

  }, {
    key: "_recycleCell",
    value: function _recycleCell(cellindex) {
      var container = this.getContainer();
      var count = container.__children__.length;

      for (var index = 0; index < count; index++) {
        var cell = container.__children__[index];

        if (cell.index == cellindex) {
          cell.visible(false);
          cell.index = -1;

          this.__pool__.push(cell);
        }
      }
    } // 复用cellindex位置的cell

  }, {
    key: "_reuseCell",
    value: function _reuseCell(cellindex) {
      var cell = this.__pool__.pop();

      if (cell == null) {
        var container = this.getContainer();
        cell = this.__config__.onCreateCell();
        cell.addTo(container).anchor(0, 1);
      }

      cell.visible(true);
      cell.index = cellindex;
      var config = this.__cellPos__[cellindex];
      cell.setPosition(config);
      var cellData = this.__data__[cellindex];

      this.__config__.onUpdateCell(cell, cellData);
    } // cellindex位置的cell是否需要复用

  }, {
    key: "_isReuse",
    value: function _isReuse(cellindex) {
      var container = this.getContainer();
      var count = container.__children__.length;

      for (var index = 0; index < count; index++) {
        var cell = container.__children__[index];

        if (cell.index == cellindex) {
          if (cell.isVisible()) {
            return false;
          } else {
            return true;
          }
        }
      }

      return true;
    } // cellindex位置的cell是否应该显示

  }, {
    key: "_isCellShow",
    value: function _isCellShow(cellindex, visibleCells) {
      var isVisible = false;

      for (var i = 0; i < visibleCells.length; i++) {
        var value = visibleCells[i];

        if (cellindex == value) {
          isVisible = true;
          break;
        }
      }

      return isVisible;
    } // 更新Cells是否需要显示

  }, {
    key: "_updateCells",
    value: function _updateCells() {
      var visibleCells = this._calcDisplayIndex(); // 遍历位置，判断是否需要显示


      for (var key in this.__cellPos__) {
        // key位置的cell是否应该可见
        var isShowCell = this._isCellShow(key, visibleCells); // 回收Cell


        if (isShowCell == false) {
          this._recycleCell(key);
        } // 复用Cell
        else if (this._isReuse(key)) {
            this._reuseCell(key);
          }
      }
    }
  }, {
    key: "update",
    value: function update() {
      _get(_getPrototypeOf(RankView.prototype), "update", this).call(this);

      this._updateCells();
    }
  }]);

  return RankView;
}(_scrollview__WEBPACK_IMPORTED_MODULE_0__["default"]);



/***/ }),

/***/ "./libs/widget/scale9sprite.js":
/*!*************************************!*\
  !*** ./libs/widget/scale9sprite.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Scale9Sprite; });
/* harmony import */ var _core_sprite__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/sprite */ "./libs/core/sprite.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var Scale9Sprite =
/*#__PURE__*/
function (_Sprite) {
  _inherits(Scale9Sprite, _Sprite);

  function Scale9Sprite(path) {
    var _this;

    _classCallCheck(this, Scale9Sprite);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Scale9Sprite).call(this, path));

    _this.setScale9Enabled(true);

    return _this;
  }

  return Scale9Sprite;
}(_core_sprite__WEBPACK_IMPORTED_MODULE_0__["default"]);



/***/ }),

/***/ "./libs/widget/scrollview.js":
/*!***********************************!*\
  !*** ./libs/widget/scrollview.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ScrollView; });
/* harmony import */ var _core_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/node */ "./libs/core/node.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var ScrollView =
/*#__PURE__*/
function (_Node) {
  _inherits(ScrollView, _Node);

  function ScrollView() {
    var _this;

    _classCallCheck(this, ScrollView);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ScrollView).call(this));

    _this.clipping();

    _this.__container__ = null;
    _this.__direction__ = ScrollView.VERTICAL;
    _this.__lastTouchPos__ = null;
    _this.__moveDelta__ = sub.p(0, 0);

    _this.setSwallowTouches(true);

    return _this;
  }

  _createClass(ScrollView, [{
    key: "setContainer",
    value: function setContainer(contariner) {
      if (this.__container__) {
        this.__container__.removeSelf();

        this.__container__ = null;
      }

      this.__container__ = contariner;
      this.addChild(this.__container__);
    }
  }, {
    key: "getContainer",
    value: function getContainer() {
      return this.__container__;
    }
  }, {
    key: "setDirection",
    value: function setDirection(direction) {
      this.__direction__ = direction;
    }
  }, {
    key: "onTouchBegan",
    value: function onTouchBegan(touch) {
      var touched = this.containsPoint(touch.worldPos);
      var visible = this.isVisible();
      this.__passing__ = touched && visible;
      this.__moveDelta__ = sub.p(0, 0);

      if (this.__passing__) {
        this.__lastTouchPos__ = touch.worldPos;
        this.__touching__ = true;
      }
    }
  }, {
    key: "onTouchMoved",
    value: function onTouchMoved(touch) {
      if (!this.__passing__) {
        return;
      }

      if (this.__lastTouchPos__ == null) {
        return;
      }

      var dtx = 0,
          dty = 0;

      if (this.__direction__ == ScrollView.HORIZONTAL) {
        dtx = touch.worldPos.x - this.__lastTouchPos__.x;
      }

      if (this.__direction__ == ScrollView.VERTICAL) {
        dty = touch.worldPos.y - this.__lastTouchPos__.y;
      }

      this.__moveDelta__ = sub.p(dtx, dty);
      this.__lastTouchPos__ = touch.worldPos;

      var pos = this.__container__.getPosition();

      var size = this.__container__.getContentSize();

      var newpos = sub.p(pos.x + dtx, pos.y + dty);

      this.__container__.move(newpos);
    }
  }, {
    key: "onTouchEnded",
    value: function onTouchEnded(touch) {
      this.__lastTouchPos__ = null;
      if (!this.__passing__) return;
      this.__touching__ = false;
    }
  }, {
    key: "onTouchCanceled",
    value: function onTouchCanceled(touch) {
      this.onTouchEnded(touch);
    }
  }, {
    key: "update",
    value: function update(dt) {
      if (!this.__container__) return;
      if (this.__touching__) return;

      var pos = this.__container__.getPosition();

      var anchor = this.__container__.getAnchorPoint();

      var size = this.__container__.getContentSize();

      var bottom = pos.y - size.height * anchor.y;
      var top = bottom + size.height;
      var left = pos.x - size.width * anchor.x;
      var right = left + size.width; // 垂直方向

      if (this.__direction__ == ScrollView.VERTICAL && top < this.__size__.height) {
        var targetPosY = this.__size__.height - size.height * (1 - anchor.y);
        var offsety = (targetPosY - pos.y) / 10;
        var newy = pos.y + offsety;

        if (Math.abs(newy - targetPosY) < 0.1) {
          newy = targetPosY;
        }

        this.__container__.move(sub.p(pos.x, newy));

        this.__moveDelta__ = sub.p(0, 0);
      } else if (this.__direction__ == ScrollView.VERTICAL && bottom > 0) {
        var _targetPosY = size.height * anchor.y;

        var _offsety = (pos.y - _targetPosY) / 10;

        var _newy = pos.y - _offsety;

        if (Math.abs(_newy - _targetPosY) < 0.1) {
          _newy = _targetPosY;
        }

        this.__container__.move(sub.p(pos.x, _newy));

        this.__moveDelta__ = sub.p(0, 0);
      } // 水平方向


      if (this.__direction__ == ScrollView.HORIZONTAL && right < this.__size__.width) {
        var targetPosX = this.__size__.width - size.width * (1 - anchor.x);
        var offsetx = (targetPosX - pos.x) / 10;
        var newx = pos.x + offsetx;

        if (Math.abs(newx - targetPosX) < 0.1) {
          newx = targetPosX;
        }

        this.__container__.move(sub.p(newx, pos.y));

        this.__moveDelta__ = sub.p(0, 0);
      } else if (this.__direction__ == ScrollView.HORIZONTAL && left > 0) {
        var _targetPosX = size.width * anchor.x;

        var _offsetx = (pos.x - _targetPosX) / 10;

        var _newx = pos.x - _offsetx;

        if (Math.abs(_newx - _targetPosX) < 0.1) {
          _newx = _targetPosX;
        }

        this.__container__.move(sub.p(_newx, pos.y));

        this.__moveDelta__ = sub.p(0, 0);
      } else {
        if (this.__moveDelta__.x == 0 && this.__moveDelta__.y == 0) {
          return;
        }

        this.__moveDelta__ = sub.p(this.__moveDelta__.x * 0.95, this.__moveDelta__.y * 0.95);

        if (Math.abs(this.__moveDelta__.x) < 0.1 && Math.abs(this.__moveDelta__.y) < 0.1) {
          this.__moveDelta__ = sub.p(0, 0);
          return;
        }

        this.__container__.move(sub.p(this.__moveDelta__.x + pos.x, this.__moveDelta__.y + pos.y));
      }
    }
  }]);

  return ScrollView;
}(_core_node__WEBPACK_IMPORTED_MODULE_0__["default"]);


ScrollView.HORIZONTAL = 0;
ScrollView.VERTICAL = 1;

/***/ }),

/***/ "./src/RankScene.js":
/*!**************************!*\
  !*** ./src/RankScene.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return RankScene; });
/* harmony import */ var _utils_WxSubHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/WxSubHelper */ "./src/utils/WxSubHelper.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var RankScene =
/*#__PURE__*/
function (_sub$Scene) {
  _inherits(RankScene, _sub$Scene);

  function RankScene() {
    var _this;

    _classCallCheck(this, RankScene);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RankScene).call(this));
    _this._viewPool = {};
    _this._viewStack = [];
    _this._enableState = false;
    _this._viewFuncPool = {};
    _this._lastViewId = undefined;
    return _this;
  } // ------------------ 公开接口 ------------------


  _createClass(RankScene, [{
    key: "registerViewFunc",
    value: function registerViewFunc(type, funcObj) {
      this._viewFuncPool[type] = funcObj;
    }
  }, {
    key: "unregisterViewFunc",
    value: function unregisterViewFunc(type) {
      delete this._viewFuncPool[type];
    }
  }, {
    key: "isViewValid",
    value: function isViewValid(view) {
      return !!this._viewPool[view._viewId];
    } // ------------------ 与主域交互的消息处理 ------------------

  }, {
    key: "onMessage",
    value: function onMessage(res) {
      if (!res) {
        return;
      }

      var cmd = "onMsg" + res.cmd;

      if (typeof this[cmd] !== "function") {
        console.warn("===========不支持该命令: ", cmd);
        return;
      }

      this[cmd](res);
    }
  }, {
    key: "onMsgChangeCanvasSize",
    value: function onMsgChangeCanvasSize(data) {
      sub.onCanvasSizeChange(data.winSize);
      var size = this.getContentSize();

      if (size.width == sub.display.width && size.height == sub.display.height) {
        return;
      }

      this.setContentSize(sub.display.width, sub.display.height);
    }
  }, {
    key: "onMsgCreateView",
    value: function onMsgCreateView(data) {
      if (!this._viewFuncPool[data.type]) {
        console.warn("=========RankScene::onMsgCreateView unsupport type", data.type);
        return;
      }

      var view = this._viewFuncPool[data.type].onCreateView(data);

      if (!view) {
        return;
      }

      view.anchor(sub.p(0, 1));
      view._viewId = data.viewId;
      this._viewPool[data.viewId] = view;

      this._viewFuncPool[data.type].onInitView(view, data);
    }
  }, {
    key: "onMsgDeleteView",
    value: function onMsgDeleteView(data) {
      if (!this._viewPool[data.viewId]) {
        return;
      }

      this._viewPool[data.viewId].removeSelf(); // 解除父子关系


      delete this._viewPool[data.viewId];
      this._viewStack = this._viewStack.filter(function (id) {
        return id != data.viewId;
      });

      this._onViewStateChange();
    }
  }, {
    key: "onMsgSetViewVisible",
    value: function onMsgSetViewVisible(data) {
      if (!this._viewPool[data.viewId]) {
        return;
      }

      var child = this.getChild()[0];

      if (child && child.isVisible()) {
        child.removeSelf(); // 解除父子关系

        this._viewStack.push(child._viewId);
      }

      this._viewPool[data.viewId].setVisible(data.visible);

      this._viewPool[data.viewId].removeSelf(); // 解除父子关系


      this._viewStack = this._viewStack.filter(function (id) {
        return id != data.viewId;
      });
      data.visible && this._viewStack.push(data.viewId);

      this._onViewStateChange();
    }
  }, {
    key: "onMsgSetViewOffset",
    value: function onMsgSetViewOffset(data) {
      if (!this._viewPool[data.viewId]) {
        return;
      }

      this._viewPool[data.viewId].viewOffset = data.offset;
      var child = this.getChild()[0];

      if (child && child.isVisible() && child._viewId == data.viewId) {
        this.setTouchOffset(data.offset);
      }
    }
  }, {
    key: "onMsgSetData",
    value: function onMsgSetData(data) {
      if (data.op == "setUserOpenId") {
        _utils_WxSubHelper__WEBPACK_IMPORTED_MODULE_0__["default"].setSelfOpenId(data.openId);
        _utils_WxSubHelper__WEBPACK_IMPORTED_MODULE_0__["default"].setGameUserFlag();
        return;
      }

      if (!this._viewFuncPool[data.type]) {
        console.warn("=========RankScene::onMsgSetData unsupport type", data.type);
        return;
      }

      this._viewFuncPool[data.type].onSetData(data);
    }
  }, {
    key: "onMsgSetTouch",
    value: function onMsgSetTouch(data) {
      if (data.touch) {
        this.enableTouchEvents();
      } else {
        this.disableTouchEvents();
      }
    } // ------------------ 私有接口 ------------------

  }, {
    key: "_enableScene",
    value: function _enableScene() {
      if (this._enableState) {
        return;
      }

      this._enableState = true;
      this.enableScheduler();
      this.enableTouchEvents();
    }
  }, {
    key: "_disableScene",
    value: function _disableScene() {
      if (!this._enableState) {
        return;
      }

      this._enableState = false;
      this.disableScheduler();
      this.disableTouchEvents();

      if (Object.keys(this._viewPool).length == 0) {
        this.clearScreen();
      }
    }
  }, {
    key: "_onViewStateChange",
    value: function _onViewStateChange() {
      var child = this.getChild()[0];

      if (!child || !child.isVisible()) {
        child && child.removeSelf(); // 解除父子关系

        while (this._viewStack.length) {
          var lastId = this._viewStack.pop();

          if (this._viewPool[lastId]) {
            this._viewPool[lastId].addTo(this).layout(sub.p(0, 1));

            this.setTouchOffset(this._viewPool[lastId].viewOffset);

            if (lastId != this._lastViewId) {
              this.clearScreen();
            }

            this._lastViewId = lastId;
            child = this._viewPool[lastId];
            break;
          }
        }

        child && child.isVisible() ? this._enableScene() : this._disableScene();
      } else {
        this._enableScene();
      }
    }
  }]);

  return RankScene;
}(sub.Scene);


;

/***/ }),

/***/ "./src/utils/WxHelper.js":
/*!*******************************!*\
  !*** ./src/utils/WxHelper.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// 微信接口辅助类
/* harmony default export */ __webpack_exports__["default"] = ({
  getUserCloudStorage: function getUserCloudStorage(keyList) {
    return new Promise(function (resolve, reject) {
      wx.getUserCloudStorage({
        keyList: keyList,
        success: function success(res) {
          resolve(res);
        },
        fail: function fail(res) {
          resolve();
          console.warn("获取用户云端数据失败：", res);
        }
      });
    });
  },
  getFriendCloudStorage: function getFriendCloudStorage(keyList) {
    return new Promise(function (resolve, reject) {
      wx.getFriendCloudStorage({
        keyList: keyList,
        success: function success(res) {
          resolve(res);
        },
        fail: function fail(res) {
          resolve();
          console.warn("获取朋友圈云端数据失败：", res);
        }
      });
    });
  },
  setUserCloudStorage: function setUserCloudStorage(kvDataList) {
    return new Promise(function (resolve, reject) {
      wx.setUserCloudStorage({
        KVDataList: kvDataList,
        success: function success() {
          resolve();
        },
        fail: function fail(res) {
          resolve();
          console.warn("上传数据失败：", res);
        }
      });
    });
  },
  shareMessageToFriend: function shareMessageToFriend(reqData) {
    return new Promise(function (resolve, reject) {
      wx.shareMessageToFriend({
        openId: reqData.openId,
        title: reqData.title,
        imageUrl: reqData.imageUrl,
        imageUrlId: reqData.imageUrlId,
        success: function success(res) {
          resolve(true);
        },
        fail: function fail(res) {
          resolve(false);
          console.warn("定向分享失败: ", res);
        }
      });
    });
  },
  getPotentialFriendList: function getPotentialFriendList() {
    return new Promise(function (resolve, reject) {
      wx.getPotentialFriendList({
        success: function success(res) {
          resolve(res);
        },
        fail: function fail(res) {
          resolve();
          console.warn("获取可能对游戏感兴趣的未注册的好友名单失败: ", res);
        }
      });
    });
  }
});

/***/ }),

/***/ "./src/utils/WxSubHelper.js":
/*!**********************************!*\
  !*** ./src/utils/WxSubHelper.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _yftx_YftxViewFunc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../yftx/YftxViewFunc */ "./src/yftx/YftxViewFunc.js");
/* harmony import */ var _WxHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./WxHelper */ "./src/utils/WxHelper.js");

 // 子域（开放数据域）辅助类

/* harmony default export */ __webpack_exports__["default"] = ({
  KEY_NAME: "game_user",
  getAllKeys: function getAllKeys() {
    // 一个是血战到底闯关排行榜，一个是有福同享，一个用于之后获取好友列表
    return ["xzdd_week", _yftx_YftxViewFunc__WEBPACK_IMPORTED_MODULE_0__["default"].KEY_NAME, this.KEY_NAME];
  },
  setSelfOpenId: function setSelfOpenId(openId) {
    this._selfOpenId = openId;
  },
  setGameUserFlag: function setGameUserFlag() {
    if (this._isSetFlag) {
      return;
    }

    this._isSetFlag = true; // 避免重复请求

    var kvData = {
      key: this.KEY_NAME,
      value: "1"
    };
    _WxHelper__WEBPACK_IMPORTED_MODULE_1__["default"].setUserCloudStorage([kvData]); // 设置这个仅仅是用于之后可以获取好友列表
  },
  getPotentialFriendData: function getPotentialFriendData() {
    return new Promise(function (resolve, reject) {
      _WxHelper__WEBPACK_IMPORTED_MODULE_1__["default"].getPotentialFriendList().then(function (res) {
        var ret = {};

        if (res && res.list && res.list.length) {
          for (var j = 0; j < res.list.length; j++) {
            var itemData = res.list[j];

            if (!itemData) {
              continue;
            }

            ret[itemData.openid] = itemData;
          }
        }

        resolve(ret);
      });
    });
  },
  getGameFriendData: function getGameFriendData() {
    var self = this;
    return new Promise(function (resolve, reject) {
      _WxHelper__WEBPACK_IMPORTED_MODULE_1__["default"].getFriendCloudStorage(self.getAllKeys()).then(function (res) {
        var ret = {};

        if (res && res.data && res.data.length) {
          for (var i = 0; i < res.data.length; i++) {
            var itemData = res.data[i];

            if (!itemData) {
              continue;
            }

            ret[itemData.openid] = itemData;
          }
        }

        resolve(ret);
      });
    });
  },
  getRandomFriendList: function getRandomFriendList(processCb, potentialApiCallCount, callFriendApi, maxCount) {
    var friendApiCallCount = callFriendApi ? 1 : 0;
    var totalCount = potentialApiCallCount + friendApiCallCount; // 感兴趣好友接口请求次数加玩过游戏的好友接口请求次数之和

    var curCount = 0;
    var curPotentialCount = 0;
    var friendListData = this._friendListData || [];
    this._friendListData = friendListData; // 缓存数据

    var lastPotentialData = {};
    var self = this;

    var callback = function callback(data, type) {
      curCount++; // 感兴趣好友 拉取到两次一样的数据 就不再拉取感兴趣好友

      if (type == 1) {
        curPotentialCount++;

        if (self.isSameKeyObject(data, lastPotentialData)) {
          potentialApiCallCount = curPotentialCount;
          totalCount = potentialApiCallCount + friendApiCallCount;
        } else {
          lastPotentialData = data;
        }
      } // 合并数据


      for (var key in data) {
        var needAdd = true;

        for (var i = 0; i < friendListData.length; i++) {
          if (friendListData[i].openid == key) {
            // 过滤重复数据
            needAdd = false;
            break;
          }
        }

        if (needAdd) {
          friendListData.push(data[key]);
        }
      } // 过滤自己及今天已经分享过的


      var retArr = self.filterFriendList(friendListData); // 人数拉取到最多显示的人数 就不再拉取感兴趣好友了

      if (retArr.length >= maxCount) {
        potentialApiCallCount = curPotentialCount;
        totalCount = potentialApiCallCount + friendApiCallCount;
      }

      processCb(retArr, curCount >= totalCount); // 拉取感兴趣好友

      if (type == 1 && curPotentialCount < potentialApiCallCount) {
        self.getPotentialFriendData().then(function (ret) {
          callback(ret, 1);
        }); // 感兴趣好友
      }
    };

    if (potentialApiCallCount > 0) {
      this.getPotentialFriendData().then(function (ret) {
        callback(ret, 1);
      }); // 感兴趣好友
    }

    if (callFriendApi) {
      this.getGameFriendData().then(function (ret) {
        callback(ret, 2);
      }); // 玩过游戏的好友
    }
  },
  filterFriendList: function filterFriendList(friendList, maxCount) {
    var retArr = [];
    var filterArr = this._filterArr || [];

    for (var i = 0; i < friendList.length; i++) {
      var openId = friendList[i].openid;

      if (openId == this._selfOpenId) {
        continue; // 排除自己
      }

      if (this.indexOfArr(filterArr, openId) != -1) {
        continue; // 排除今日分享过的
      }

      if (maxCount != undefined && retArr.length == maxCount) {
        break; // 达到最多人数
      }

      retArr.push(friendList[i]);
    }

    return retArr;
  },
  getTodayFilterUserArr: function getTodayFilterUserArr(key) {
    var self = this;
    return new Promise(function (resolve, reject) {
      _WxHelper__WEBPACK_IMPORTED_MODULE_1__["default"].getUserCloudStorage([key]).then(function (res) {
        var filterArr = [];

        if (res && res.KVDataList && res.KVDataList[0] && res.KVDataList[0].key == key && res.KVDataList[0].value) {
          var subKey = self.getCurDateStr();
          filterArr = JSON.parse(res.KVDataList[0].value)[subKey] || [];
        }

        resolve(filterArr);
      });
    });
  },
  initFilterArr: function initFilterArr(key) {
    var self = this;
    return new Promise(function (resolve, reject) {
      if (self._filterArr) {
        resolve(self._filterArr);
        return;
      }

      self.getTodayFilterUserArr(key).then(function (arr) {
        self._filterArr = arr;
        resolve(arr);
      });
    });
  },
  saveLocalViewData: function saveLocalViewData(data) {
    this._localViewData = data;
  },
  getLocalViewData: function getLocalViewData(maxCount) {
    if (!this._localViewData) {
      return undefined;
    }

    return this.filterFriendList(this._localViewData, maxCount);
  },
  addFilterUser: function addFilterUser(key, userOpenId) {
    this._filterArr = this._filterArr || [];

    this._filterArr.push(userOpenId);

    this._filterArr = this.uniqueArr(this._filterArr);
    var value = {};
    var subKey = this.getCurDateStr();
    value[subKey] = this._filterArr;
    _WxHelper__WEBPACK_IMPORTED_MODULE_1__["default"].setUserCloudStorage([{
      key: key,
      value: JSON.stringify(value)
    }]);
  },
  // [1, 2, 3, 4, 5] => [[1,2], [3,4], [5]]
  zipArr: function zipArr(arr, subArrLen) {
    var retArr = [];

    for (var i = 0; i < arr.length; i++) {
      var index = Math.floor(i / subArrLen);
      var subIndex = i % subArrLen;
      retArr[index] = retArr[index] || [];
      retArr[index][subIndex] = arr[i];
    }

    return retArr;
  },
  filterArr: function filterArr(arr, filterFn) {
    var retArr = [];

    for (var i = 0; i < arr.length; i++) {
      if (!filterFn(arr[i])) {
        retArr.push(arr[i]);
      }
    }

    return retArr;
  },
  uniqueArr: function uniqueArr(arr, keyFn) {
    var tmpMap = {};

    for (var i = 0; i < arr.length; i++) {
      var key = keyFn ? keyFn(arr[i]) : arr[i];
      tmpMap[key] = arr[i];
    }

    var retArr = [];

    for (var _key in tmpMap) {
      retArr.push(tmpMap[_key]);
    }

    return retArr;
  },
  indexOfArr: function indexOfArr(arr, obj) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == obj) {
        return i;
      }
    }

    return -1;
  },
  trimString: function trimString(str, length, appendStr) {
    var newStr = str || "";
    appendStr = appendStr || "";

    if (newStr.length <= length) {
      return newStr;
    }

    return newStr.substring(0, length) + appendStr;
  },
  getBaseImgDir: function getBaseImgDir(imgPathData, type) {
    if (!imgPathData || !imgPathData[0]) {
      return "";
    }

    var lastIndex = imgPathData[0].lastIndexOf(type + "/");
    return imgPathData[0].substr(0, lastIndex + type.length + 1);
  },
  getCurDateStr: function getCurDateStr() {
    var format = "-";
    var dateObj = new Date();
    var year = dateObj.getFullYear();
    var month = dateObj.getMonth() + 1;
    var day = dateObj.getDate();
    return year + format + month + format + day;
  },
  isSameKeyObject: function isSameKeyObject(lh, rh) {
    var lhKeyArr = Object.keys(lh);
    var rhKeyArr = Object.keys(rh);

    if (lhKeyArr.length != rhKeyArr.length) {
      return false;
    }

    var len = lhKeyArr.length;

    for (var i = 0; i < len; i++) {
      var key = lhKeyArr[i];
      var j = 0;

      for (; j < len; j++) {
        if (key == rhKeyArr[j]) {
          break;
        }
      }

      if (j == len) {
        return false;
      }
    }

    return true;
  }
});

/***/ }),

/***/ "./src/yftx/YftxCell.js":
/*!******************************!*\
  !*** ./src/yftx/YftxCell.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return YftxCell; });
/* harmony import */ var _utils_WxSubHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/WxSubHelper */ "./src/utils/WxSubHelper.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

 // 有福同享好友列表中的单个好友节点

var YftxCell =
/*#__PURE__*/
function (_sub$Node) {
  _inherits(YftxCell, _sub$Node);

  function YftxCell(arg) {
    var _this;

    _classCallCheck(this, YftxCell);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(YftxCell).call(this));
    _this._baseImgDir = arg.baseImgDir;
    _this._btnCb = arg.btnCb;
    var cellSize = arg.subCellSize;
    var mode = arg.mode;

    _this.size(cellSize);

    _this._bg = new sub.Scale9Sprite(_this._baseImgDir + "bg2.png").size(cellSize).addTo(_assertThisInitialized(_this)).anchor(0.5, 0.5).layout(sub.p(0.5, 0.5));

    _this._createAvatarNode();

    _this._txtNickname = new sub.Label("", 24).addTo(_this._bg).fontColor(sub.color(98, 88, 124, 255)).anchor(0.0, 0.5).layout(sub.p(0, 0.5), sub.p(104, 0)); //let btnImg = mode == "yftx" ? "btn_yqld.png" : "btn_fx.png";

    _this._btn = new sub.Button().addTo(_this._bg).setTextVisible(false).size(sub.size(137, 56)).setImage(_this._baseImgDir + "btn_fx.png").anchor(0.5, 0.5).layout(sub.p(0, 0.5), sub.p(383, 0));

    _this._btn.setSwallowTouches(false);

    return _this;
  }

  _createClass(YftxCell, [{
    key: "_createAvatarNode",
    value: function _createAvatarNode() {
      var clipNode = new sub.Node().size(sub.size(70, 70)).addTo(this._bg).anchor(0, 0.5).layout(sub.p(0, 0.5), sub.p(14, 0));
      clipNode.enableClipMode();
      clipNode.setClipCornerRadius(5);
      this._imgAvatar = new sub.Sprite().addTo(clipNode).scale(0.53).anchor(0.5, 0.5).layout(sub.p(0.5, 0.5));
      var imgAvatarBg = new sub.Sprite(this._baseImgDir + "head_bg.png").addTo(this._bg).anchor(0, 0.5).layout(sub.p(0, 0.5), sub.p(14, 0));
    }
  }, {
    key: "updateView",
    value: function updateView(data) {
      if (!data) {
        this.visible(false);

        this._btn.setClickCallback(undefined);

        return;
      }

      this.visible(true);

      this._imgAvatar.loadImage(data.avatarUrl);

      var name = _utils_WxSubHelper__WEBPACK_IMPORTED_MODULE_0__["default"].trimString(data.nickname, 5, "..");

      this._txtNickname.setText(name);

      var self = this;

      this._btn.setClickCallback(function () {
        self._btnCb(self._btn, data);
      });
    }
  }]);

  return YftxCell;
}(sub.Node);



/***/ }),

/***/ "./src/yftx/YftxRow.js":
/*!*****************************!*\
  !*** ./src/yftx/YftxRow.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return YftxRow; });
/* harmony import */ var _YftxCell__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./YftxCell */ "./src/yftx/YftxCell.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

 // 有福同享好友列表中的一行的节点

var YftxRow =
/*#__PURE__*/
function (_sub$Node) {
  _inherits(YftxRow, _sub$Node);

  function YftxRow(arg) {
    var _this;

    _classCallCheck(this, YftxRow);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(YftxRow).call(this));
    var cellSize = arg.cellSize;

    _this.size(cellSize);

    var subCellSize = sub.size(cellSize.width / 2, cellSize.height);
    arg.subCellSize = subCellSize;
    _this._leftCell = new _YftxCell__WEBPACK_IMPORTED_MODULE_0__["default"](arg).addTo(_assertThisInitialized(_this)).anchor(0, 0.5).layout(sub.p(0, 0.5));
    _this._rightCell = new _YftxCell__WEBPACK_IMPORTED_MODULE_0__["default"](arg).addTo(_assertThisInitialized(_this)).anchor(1, 0.5).layout(sub.p(1, 0.5));
    return _this;
  }

  _createClass(YftxRow, [{
    key: "updateView",
    value: function updateView(data) {
      this._leftCell.updateView(data[0]);

      this._rightCell.updateView(data[1]);
    }
  }]);

  return YftxRow;
}(sub.Node);



/***/ }),

/***/ "./src/yftx/YftxView.js":
/*!******************************!*\
  !*** ./src/yftx/YftxView.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return YftxView; });
/* harmony import */ var _YftxRow__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./YftxRow */ "./src/yftx/YftxRow.js");
/* harmony import */ var _utils_WxSubHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/WxSubHelper */ "./src/utils/WxSubHelper.js");
/* harmony import */ var _utils_WxHelper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/WxHelper */ "./src/utils/WxHelper.js");
/* harmony import */ var _YftxViewFunc__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./YftxViewFunc */ "./src/yftx/YftxViewFunc.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




 // 有福同享好友列表

var YftxView =
/*#__PURE__*/
function (_sub$Node) {
  _inherits(YftxView, _sub$Node);

  function YftxView(data) {
    var _this;

    _classCallCheck(this, YftxView);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(YftxView).call(this));
    _this._MAX_FRIEND_COUNT = 20; // 最多显示的好友数

    _this._share = data.custom || {};

    _this.size(data.size);

    return _this;
  }

  _createClass(YftxView, [{
    key: "initView",
    value: function initView(data, baseImgDir) {
      var txtTip = new sub.Label("加载中...", 28).addTo(this).fontColor(sub.color(255, 250, 239, 255)).anchor(0.5, 0.5).layout(sub.p(0.5, 0.5));
      this._tip = txtTip;
      var self = this;
      sub.Loader.instance.load(data.imgPathData, function () {
        if (!sub.curScene.isViewValid(self)) {
          return;
        }

        var cellSize = sub.size(data.size.width, 97);
        var cellArg = {};
        cellArg.cellSize = cellSize;
        cellArg.baseImgDir = baseImgDir;
        cellArg.btnCb = self._onBtnClicked.bind(self);
        cellArg.mode = self._share.mode;
        var config = {
          data: [],
          cellSize: cellSize,
          cellOffsetX: 3,
          onCreateCell: function onCreateCell() {
            return new _YftxRow__WEBPACK_IMPORTED_MODULE_0__["default"](cellArg);
          },
          onUpdateCell: function onUpdateCell(cell, itemData) {
            cell.updateView(itemData);
          }
        };
        var view = new sub.RankView(config);
        view.size(sub.size(data.size.width, data.size.height)).addTo(self).anchor(0.5, 1).layout(sub.p(0.5, 1), sub.p(0, 0));
        self._view = view;

        self._initViewData();
      });
    } // ------------------ 私有接口 ------------------

  }, {
    key: "_initViewData",
    value: function _initViewData() {
      var self = this;
      _utils_WxSubHelper__WEBPACK_IMPORTED_MODULE_1__["default"].initFilterArr(_YftxViewFunc__WEBPACK_IMPORTED_MODULE_3__["default"].KEY_NAME).then(function (filterArr) {
        var cache = _utils_WxSubHelper__WEBPACK_IMPORTED_MODULE_1__["default"].getLocalViewData();

        if (cache) {
          self._onGetFriendList(cache, true);
        } else {
          // 这里有用到FilterArr，所以需要初始化
          _utils_WxSubHelper__WEBPACK_IMPORTED_MODULE_1__["default"].getRandomFriendList(self._onGetFriendList.bind(self), 8, true, self._MAX_FRIEND_COUNT);
        }
      });
    }
  }, {
    key: "_onGetFriendList",
    value: function _onGetFriendList(viewDataArr, isEnd) {
      this._isEnd = isEnd;
      _utils_WxSubHelper__WEBPACK_IMPORTED_MODULE_1__["default"].saveLocalViewData(viewDataArr); // 缓存数据

      if (!sub.curScene.isViewValid(this)) {
        return;
      }

      var viewData = _utils_WxSubHelper__WEBPACK_IMPORTED_MODULE_1__["default"].getLocalViewData(this._MAX_FRIEND_COUNT);

      this._updateViewData(viewData);
    }
  }, {
    key: "_onBtnClicked",
    value: function _onBtnClicked(btn, itemData) {
      if (this._forbidClick) {
        return;
      }

      var reqData = {};
      reqData.openId = itemData.openid;
      reqData.title = this._share.title;
      reqData.imageUrl = this._share.image;
      this._forbidClick = true;
      var self = this;
      _utils_WxHelper__WEBPACK_IMPORTED_MODULE_2__["default"].shareMessageToFriend(reqData).then(function (res) {
        self._forbidClick = false;

        if (!res) {
          return;
        }

        self._onShareSuccess(itemData.openid);
      });
    }
  }, {
    key: "_onShareSuccess",
    value: function _onShareSuccess(shareUserOpenId) {
      // 记录已分享用户
      _utils_WxSubHelper__WEBPACK_IMPORTED_MODULE_1__["default"].addFilterUser(_YftxViewFunc__WEBPACK_IMPORTED_MODULE_3__["default"].KEY_NAME, shareUserOpenId); // 记录本日已分享用户

      if (!sub.curScene.isViewValid(this)) {
        return;
      } // 获取最新的本地视图数据（内部有过滤）


      var viewData = _utils_WxSubHelper__WEBPACK_IMPORTED_MODULE_1__["default"].getLocalViewData(this._MAX_FRIEND_COUNT);

      this._updateViewData(viewData); // 拉取好友数据结束了 并且 显示的好友数还达不到最多的个数，这时分享1次，请求一次感兴趣好友接口


      if (this._isEnd && viewData.length < this._MAX_FRIEND_COUNT) {
        _utils_WxSubHelper__WEBPACK_IMPORTED_MODULE_1__["default"].getRandomFriendList(this._onGetFriendList.bind(this), 8, false, this._MAX_FRIEND_COUNT);
      }
    }
  }, {
    key: "_updateViewData",
    value: function _updateViewData(viewData) {
      if (this._isEnd && viewData.length == 0) {
        this._tip.setText("您当前暂无可分享的微信好友哦~");

        this._tip.visible(true);
      } else if (viewData.length > 0) {
        this._tip.visible(false);
      }

      var arr = _utils_WxSubHelper__WEBPACK_IMPORTED_MODULE_1__["default"].zipArr(viewData, 2);

      this._view.setData(arr);
    }
  }]);

  return YftxView;
}(sub.Node);



/***/ }),

/***/ "./src/yftx/YftxViewFunc.js":
/*!**********************************!*\
  !*** ./src/yftx/YftxViewFunc.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _YftxView__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./YftxView */ "./src/yftx/YftxView.js");
/* harmony import */ var _utils_WxSubHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/WxSubHelper */ "./src/utils/WxSubHelper.js");

 // 有福同享视图函数类

/* harmony default export */ __webpack_exports__["default"] = ({
  TYPE_NAME: "yftx",
  KEY_NAME: "yftx_daily",
  // ------------------ viewFunc ------------------
  onCreateView: function onCreateView(data) {
    var view = new _YftxView__WEBPACK_IMPORTED_MODULE_0__["default"](data);
    return view;
  },
  onInitView: function onInitView(view, data) {
    var baseImgDir = _utils_WxSubHelper__WEBPACK_IMPORTED_MODULE_1__["default"].getBaseImgDir(data.imgPathData, "subcontext");
    view.initView(data, baseImgDir);
  },
  onSetData: function onSetData(data) {}
});

/***/ })

/******/ });
//# sourceMappingURL=index.js.map