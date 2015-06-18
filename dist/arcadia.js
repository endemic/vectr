!function(e){"object"==typeof exports?module.exports=e():"function"==typeof define&&define.amd?define(e):"undefined"!=typeof window?window.Arcadia=e():"undefined"!=typeof global?global.Arcadia=e():"undefined"!=typeof self&&(self.Arcadia=e())}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var global=typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};(function() {
  var Arcadia, nowOffset;

  if (window.requestAnimationFrame === void 0) {
    window.requestAnimationFrame = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  }

  if (window.cancelAnimationFrame === void 0) {
    window.cancelAnimationFrame = window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;
  }

  if (window.performance === void 0) {
    nowOffset = Date.now();
    window.performance = {
      now: function() {
        return Date.now() - nowOffset;
      }
    };
  }

  Function.prototype.property = function(prop, desc) {
    return Object.defineProperty(this.prototype, prop, desc);
  };

  Arcadia = {
    Game: require('./game.coffee'),
    Button: require('./button.coffee'),
    Emitter: require('./emitter.coffee'),
    GameObject: require('./gameobject.coffee'),
    Label: require('./label.coffee'),
    Pool: require('./pool.coffee'),
    Scene: require('./scene.coffee'),
    Shape: require('./shape.coffee'),
    Sprite: require('./sprite.coffee')
  };

  Arcadia.FPS = 60;

  Arcadia.garbageCollected = false;

  Arcadia.lastUsedHeap = 0;

  /*
  @description Get information about the current environment
  */


  Arcadia.ENV = (function() {
    var agent, android, firefox, ios, mobile;
    agent = navigator.userAgent.toLowerCase();
    android = !!(agent.match(/android/i) && agent.match(/android/i).length > 0);
    ios = !!(agent.match(/ip(hone|od|ad)/i) && agent.match(/ip(hone|od|ad)/i).length > 0);
    firefox = !!(agent.match(/firefox/i) && agent.match(/firefox/i).length > 0);
    mobile = !!(agent.match(/mobile/i) && agent.match(/mobile/i).length > 0) || android;
    return Object.freeze({
      android: android,
      ios: ios,
      firefox: firefox,
      mobile: mobile,
      desktop: !mobile,
      cordova: window.cordova !== void 0
    });
  })();

  /*
  @description Change the active scene being displayed
  */


  Arcadia.changeScene = function(SceneClass) {
    if (typeof SceneClass !== "function") {
      throw "Invalid scene!";
    }
    Arcadia.instance.active.destroy();
    return Arcadia.instance.active = new SceneClass();
  };

  /*
  @description Static method to translate mouse/touch input to coordinates the game will understand
               Takes the <canvas> offset and scale into account
  */


  Arcadia.getPoints = function(event) {
    var i, _results;
    while (Arcadia.points.length > 0) {
      Arcadia.points.pop();
    }
    if (event.type.indexOf('mouse') !== -1) {
      return Arcadia.points.unshift({
        x: (event.pageX - Arcadia.OFFSET.x) / Arcadia.SCALE,
        y: (event.pageY - Arcadia.OFFSET.y) / Arcadia.SCALE
      });
    } else {
      i = event.touches.length;
      _results = [];
      while (i--) {
        _results.push(Arcadia.points.unshift({
          x: (event.touches[i].pageX - Arcadia.OFFSET.x) / Arcadia.SCALE,
          y: (event.touches[i].pageY - Arcadia.OFFSET.y) / Arcadia.SCALE
        }));
      }
      return _results;
    }
  };

  /*
  @description Static variables used to store music/sound effects
  */


  Arcadia.music = {};

  Arcadia.sounds = {};

  Arcadia.currentMusic = null;

  /*/**
  @description Static method to play sound effects.
               Assumes you have an instance property 'sounds' filled with Buzz sound objects.
               Otherwise you can override this method to use whatever sound library you like.
  */


  Arcadia.playSfx = function(id) {
    if (localStorage.getItem('playSfx') === "false") {
      return;
    }
    if (Arcadia.sounds[id] !== void 0 && typeof Arcadia.sounds[id].play === "function") {
      return Arcadia.sounds[id].play();
    }
  };

  /*
   * @description Static method to play music.
   * Assumes you have an instance property 'music' filled with Buzz sound objects.
   * Otherwise you can override this method to use whatever sound library you like.
  */


  Arcadia.playMusic = function(id) {
    var _ref, _ref1;
    if (localStorage.getItem('playMusic') === "false") {
      return;
    }
    if (Arcadia.currentMusic === id) {
      return;
    }
    if (id === void 0 && Arcadia.currentMusic !== null) {
      id = Arcadia.currentMusic;
    }
    if (Arcadia.currentMusic !== null) {
      if ((_ref = Arcadia.music[Arcadia.currentMusic]) != null) {
        _ref.stop();
      }
    }
    if ((_ref1 = Arcadia.music[id]) != null) {
      _ref1.play();
    }
    return Arcadia.currentMusic = id;
  };

  /*
  @description Static method to stop music.
               Assumes you have an instance property 'music' filled with Buzz sound objects.
               Otherwise you can override this method to use whatever sound library you like.
  */


  Arcadia.stopMusic = function() {
    var _ref;
    if (Arcadia.currentMusic === null) {
      return;
    }
    if ((_ref = Arcadia.music[Arcadia.currentMusic]) != null) {
      _ref.stop();
    }
    return Arcadia.currentMusic = null;
  };

  module.exports = global.Arcadia = Arcadia;

}).call(this);


},{"./button.coffee":2,"./emitter.coffee":3,"./game.coffee":4,"./gameobject.coffee":5,"./label.coffee":6,"./pool.coffee":7,"./scene.coffee":8,"./shape.coffee":9,"./sprite.coffee":10}],2:[function(require,module,exports){
(function() {
  var Button, Shape,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Shape = require('./shape.coffee');

  Button = (function(_super) {
    __extends(Button, _super);

    function Button(args) {
      var Arcadia, Label;
      if (args == null) {
        args = {};
      }
      Arcadia = require('./arcadia.coffee');
      Label = require('./label.coffee');
      this.padding = args.padding || 10;
      this.label = args.label || new Label();
      this.label.drawCanvasCache();
      if (!args.size) {
        args.size = {
          width: this.label.size.width + this.padding,
          height: this.label.size.height + this.padding
        };
      }
      Button.__super__.constructor.call(this, args);
      this.label.fixed = false;
      this.add(this.label);
      this.fixed = true;
      this.action = args.action;
      this.onPointEnd = this.onPointEnd.bind(this);
      Arcadia.element.addEventListener('mouseup', this.onPointEnd, false);
      Arcadia.element.addEventListener('touchend', this.onPointEnd, false);
    }

    /*
    @description If touch/mouse end is inside button, execute the user-supplied callback
    */


    Button.prototype.onPointEnd = function(event) {
      var i;
      if (typeof this.action !== 'function') {
        return;
      }
      i = Arcadia.points.length;
      while (i--) {
        if (this.containsPoint(Arcadia.points[i])) {
          return this.action();
        }
      }
    };

    /*
    @description Helper method to determine if mouse/touch is inside button graphic
    */


    Button.prototype.containsPoint = function(point) {
      return point.x < this.position.x + this.size.width / 2 + this.padding / 2 && point.x > this.position.x - this.size.width / 2 - this.padding / 2 && point.y < this.position.y + this.size.height / 2 + this.padding / 2 && point.y > this.position.y - this.size.height / 2 - this.padding / 2;
    };

    /*
    @description Clean up event listeners
    */


    Button.prototype.destroy = function() {
      Arcadia.element.removeEventListener('mouseup', this.onPointEnd, false);
      return Arcadia.element.removeEventListener('touchend', this.onPointEnd, false);
    };

    /*
    @description Getter/setter for font value
    */


    Button.property('font', {
      get: function() {
        return this.label.font;
      },
      set: function(font) {
        this.label.font = font;
        return this.label.dirty = true;
      }
    });

    return Button;

  })(Shape);

  module.exports = Button;

}).call(this);


},{"./arcadia.coffee":1,"./label.coffee":6,"./shape.coffee":9}],3:[function(require,module,exports){
(function() {
  var Emitter, GameObject, Pool, Shape,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  GameObject = require('./gameobject.coffee');

  Pool = require('./pool.coffee');

  Shape = require('./shape.coffee');

  Emitter = (function(_super) {
    __extends(Emitter, _super);

    /*
     * @constructor
     * @description Basic particle emitter
     * @param {string} [shape='square'] Shape of the particles. Accepts strings that are valid for Shapes (e.g. "circle", "triangle")
     * @param {number} [size=10] Size of the particles
     * @param {number} [count=25] The number of particles created for the system
    */


    function Emitter(factory, count) {
      if (count == null) {
        count = 25;
      }
      if (typeof factory !== 'function') {
        throw 'Emitter requires a factory function';
      }
      Emitter.__super__.constructor.apply(this, arguments);
      this.duration = 1;
      this.fade = false;
      this.scale = 1.0;
      this.speed = 200;
      this.i = this.particle = null;
      while (count--) {
        this.children.add(factory());
      }
      this.children.deactivateAll();
    }

    /*
     * @description Activate a particle emitter
     * @param {number} x Position of emitter on x-axis
     * @param {number} y Position of emitter on y-axis
    */


    Emitter.prototype.startAt = function(x, y) {
      var direction;
      this.children.activateAll();
      this.reset();
      this.i = this.children.length;
      while (this.i--) {
        this.particle = this.children.at(this.i);
        this.particle.position.x = x;
        this.particle.position.y = y;
        direction = Math.random() * 2 * Math.PI;
        this.particle.velocity.x = Math.cos(direction);
        this.particle.velocity.y = Math.sin(direction);
        this.particle.speed = Math.random() * this.speed;
      }
      this.timer = 0;
      this.position.x = x;
      return this.position.y = y;
    };

    Emitter.prototype.update = function(delta) {
      Emitter.__super__.update.call(this, delta);
      this.timer += delta;
      this.i = this.children.length;
      while (this.i--) {
        this.particle = this.children.at(this.i);
        if (this.timer >= this.duration) {
          this.children.deactivate(this.i);
        }
        if (this.scale !== 1.0) {
          this.particle.scale += this.scale * delta / this.duration;
        }
      }
    };

    Emitter.prototype.reset = function() {
      var _results;
      this.i = this.children.length;
      _results = [];
      while (this.i--) {
        this.particle = this.children.at(this.i);
        if (typeof this.particle.reset === 'function') {
          _results.push(this.particle.reset());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return Emitter;

  })(GameObject);

  module.exports = Emitter;

}).call(this);


},{"./gameobject.coffee":5,"./pool.coffee":7,"./shape.coffee":9}],4:[function(require,module,exports){
(function() {
  var Game,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Game = (function() {
    /*
     * @constructor
     * @description Main "game" object; sets up screens, input, etc.
     * @param {Object} args Config object. Allowed keys: width, height, scene, fitWindow
    */

    function Game(args) {
      var Arcadia;
      if (args == null) {
        args = {};
      }
      this.update = __bind(this.update, this);
      Arcadia = require('./arcadia.coffee');
      Arcadia.WIDTH = parseInt(args.width, 10) || 320;
      Arcadia.HEIGHT = parseInt(args.height, 10) || 480;
      Arcadia.SCALE = 1;
      Arcadia.OFFSET = {
        x: 0,
        y: 0
      };
      this.element = document.createElement('div');
      this.element.id = 'arcadia';
      this.canvas = document.createElement('canvas');
      this.canvas.width = Arcadia.WIDTH;
      this.canvas.height = Arcadia.HEIGHT;
      this.element.appendChild(this.canvas);
      document.body.appendChild(this.element);
      this.context = this.canvas.getContext('2d');
      this.input = {
        'left': false,
        'up': false,
        'right': false,
        'down': false,
        'w': false,
        'a': false,
        's': false,
        'd': false,
        'enter': false,
        'escape': false,
        'space': false,
        'control': false,
        'z': false,
        'x': false
      };
      this.points = [];
      Arcadia.instance = this;
      Arcadia.points = this.points;
      Arcadia.element = this.element;
      this.onResize = this.onResize.bind(this);
      this.onPointStart = this.onPointStart.bind(this);
      this.onPointMove = this.onPointMove.bind(this);
      this.onPointEnd = this.onPointEnd.bind(this);
      this.onKeyDown = this.onKeyDown.bind(this);
      this.onKeyUp = this.onKeyUp.bind(this);
      this.pause = this.pause.bind(this);
      this.resume = this.resume.bind(this);
      document.addEventListener('keydown', this.onKeyDown, false);
      document.addEventListener('keyup', this.onKeyUp, false);
      this.element.addEventListener('mousedown', this.onPointStart, false);
      this.element.addEventListener('mouseup', this.onPointEnd, false);
      this.element.addEventListener('touchstart', this.onPointStart, false);
      this.element.addEventListener('touchmove', this.onPointMove, false);
      this.element.addEventListener('touchend', this.onPointEnd, false);
      this.element.addEventListener('touchmove', function(e) {
        return e.preventDefault();
      });
      if (window.cordova !== void 0) {
        document.addEventListener('pause', this.pause, false);
        document.addEventListener('resume', this.resume, false);
      }
      this.active = new args.scene();
      if (args.fitWindow) {
        this.onResize();
        window.addEventListener('resize', this.onResize, false);
      }
      this.start();
    }

    /*
    @description Pause active scene if it has a pause method
    */


    Game.prototype.pause = function() {
      this.pausedMusic = this.currentMusic;
      Arcadia.stopMusic();
      if (typeof this.active.pause === "function") {
        return this.active.pause();
      }
    };

    /*
    @description Resume active scene if it has a pause method
    */


    Game.prototype.resume = function() {
      Arcadia.playMusic(this.pausedMusic);
      if (typeof this.active.resume === "function") {
        return this.active.resume();
      }
    };

    /*
    @description Mouse/touch event callback
    */


    Game.prototype.onPointStart = function(event) {
      Arcadia.getPoints(event);
      if (event.type.indexOf('mouse') !== -1) {
        this.element.addEventListener('mousemove', this.onPointMove, false);
      }
      if (typeof this.active.onPointStart === "function") {
        return this.active.onPointStart(this.points);
      }
    };

    /*
    @description Mouse/touch event callback
    */


    Game.prototype.onPointMove = function(event) {
      Arcadia.getPoints(event);
      if (typeof this.active.onPointMove === "function") {
        return this.active.onPointMove(this.points);
      }
    };

    /*
    @description Mouse/touch event callback
    TODO: Generates garbage
    */


    Game.prototype.onPointEnd = function(event) {
      Arcadia.getPoints(event);
      if (event.type.indexOf('mouse') !== -1) {
        this.element.removeEventListener('mousemove', this.onPointMove, false);
      }
      if (typeof this.active.onPointEnd === "function") {
        return this.active.onPointEnd(this.points);
      }
    };

    /*
    @description Keyboard event callback
    TODO: Generates garbage
    */


    Game.prototype.onKeyDown = function(event) {
      var key;
      key = this.getKey(event.keyCode);
      if (this.input[key]) {
        return;
      }
      this.input[key] = true;
      if (typeof this.active.onKeyDown === "function") {
        return this.active.onKeyDown(key);
      }
    };

    /*
    @description Keyboard event callback
    TODO: Generates garbage
    */


    Game.prototype.onKeyUp = function(event) {
      var key;
      key = this.getKey(event.keyCode);
      this.input[key] = false;
      if (typeof this.active.onKeyUp === "function") {
        return this.active.onKeyUp(key);
      }
    };

    /*
    @description Translate a keyboard event code into a meaningful string
    */


    Game.prototype.getKey = function(keyCode) {
      switch (keyCode) {
        case 37:
          return 'left';
        case 38:
          return 'up';
        case 39:
          return 'right';
        case 40:
          return 'down';
        case 87:
          return 'w';
        case 65:
          return 'a';
        case 83:
          return 's';
        case 68:
          return 'd';
        case 13:
          return 'enter';
        case 27:
          return 'escape';
        case 32:
          return 'space';
        case 17:
          return 'control';
        case 90:
          return 'z';
        case 88:
          return 'x';
      }
    };

    /*
     * @description Start the event/animation loops
    */


    Game.prototype.start = function() {
      this.previousDelta = window.performance.now();
      if (window.performance.memory != null) {
        Arcadia.lastUsedHeap = window.performance.memory.usedJSHeapSize;
      }
      return this.updateId = window.requestAnimationFrame(this.update);
    };

    /*
    @description Cancel draw/update loops
    */


    Game.prototype.stop = function() {
      return window.cancelAnimationFrame(this.updateId);
    };

    /*
    @description Update callback
    */


    Game.prototype.update = function(currentDelta) {
      var delta;
      delta = currentDelta - this.previousDelta;
      this.previousDelta = currentDelta;
      Arcadia.FPS = Arcadia.FPS * 0.9 + 1000 / delta * 0.1;
      if (window.performance.memory != null) {
        if (window.performance.memory.usedJSHeapSize < Arcadia.lastUsedHeap) {
          Arcadia.garbageCollected = true;
        }
        Arcadia.lastUsedHeap = window.performance.memory.usedJSHeapSize;
      }
      this.active.draw(this.context);
      this.active.update(delta / 1000);
      Arcadia.garbageCollected = false;
      return this.updateId = window.requestAnimationFrame(this.update);
    };

    /*
    @description Change size of canvas based on pixel density
    */


    Game.prototype.setPixelRatio = function() {
      if (window.devicePixelRatio === void 0) {
        window.devicePixelRatio = 1;
      }
      if (this.context.backingStorePixelRatio === void 0) {
        this.context.backingStorePixelRatio = this.context.webkitBackingStorePixelRatio || 1;
      }
      Arcadia.PIXEL_RATIO = window.devicePixelRatio / this.context.backingStorePixelRatio;
      this.canvas.width = Arcadia.WIDTH * Arcadia.PIXEL_RATIO;
      this.canvas.height = Arcadia.HEIGHT * Arcadia.PIXEL_RATIO;
      this.canvas.style.width = "" + Arcadia.WIDTH + "px";
      return this.canvas.style.height = "" + Arcadia.HEIGHT + "px";
    };

    /*
    @description Handle window resize events. Scale the canvas element to max out the size of the current window, keep aspect ratio
    */


    Game.prototype.onResize = function() {
      var aspectRatio, height, margin, orientation, width;
      width = window.innerWidth;
      height = window.innerHeight;
      if (width > height) {
        orientation = "landscape";
        aspectRatio = Arcadia.WIDTH / Arcadia.HEIGHT;
      } else {
        orientation = "portrait";
        aspectRatio = Arcadia.HEIGHT / Arcadia.WIDTH;
      }
      if (orientation === "landscape") {
        if (width / aspectRatio > height) {
          width = height * aspectRatio;
          margin = '0 ' + ((window.innerWidth - width) / 2) + 'px';
        } else if (width / aspectRatio < height) {
          height = width / aspectRatio;
          margin = ((window.innerHeight - height) / 2) + 'px 0';
        }
      } else if (orientation === "portrait") {
        if (height / aspectRatio > width) {
          height = width * aspectRatio;
          margin = ((window.innerHeight - height) / 2) + 'px 0';
        } else if (height / aspectRatio < width) {
          width = height / aspectRatio;
          margin = '0 ' + ((window.innerWidth - width) / 2) + 'px';
        }
      }
      Arcadia.SCALE = height / Arcadia.HEIGHT;
      Arcadia.OFFSET.x = (window.innerWidth - width) / 2;
      Arcadia.OFFSET.y = (window.innerHeight - height) / 2;
      this.element.setAttribute('style', "position: relative; width: " + width + "px; height: " + height + "px; margin: " + margin + ";");
      return this.canvas.setAttribute('style', "position: absolute; left: 0; top: 0; -webkit-transform: scale(" + Arcadia.SCALE + "); -webkit-transform-origin: 0 0; transform: scale(" + Arcadia.SCALE + "); transform-origin: 0 0;");
    };

    return Game;

  })();

  module.exports = Game;

}).call(this);


},{"./arcadia.coffee":1}],5:[function(require,module,exports){
(function() {
  var GameObject, Pool;

  Pool = require('./pool.coffee');

  GameObject = (function() {
    function GameObject(args) {
      if (args == null) {
        args = {};
      }
      this.fixed = args.fixed || false;
      this.scale = args.scale || 1;
      this.rotation = args.rotation || 0;
      this.alpha = args.alpha || 1;
      if (typeof args.position === 'object' && args.position.x && args.position.y) {
        this.position = {
          x: args.position.x,
          y: args.position.y
        };
      } else {
        this.position = {
          x: 0,
          y: 0
        };
      }
      this.children = new Pool();
    }

    /*
    @description Overridden in child objects
    */


    GameObject.prototype.drawCanvasCache = function() {
      return null;
    };

    /*
    @description Draw child objects
    @param {CanvasRenderingContext2D} context
    */


    GameObject.prototype.draw = function(context, offsetX, offsetY) {
      if (offsetX == null) {
        offsetX = 0;
      }
      if (offsetY == null) {
        offsetY = 0;
      }
      return this.children.draw(context, offsetX, offsetY);
    };

    /*
    @description Update child objects
    @param {Number} delta Time since last update (in seconds)
    */


    GameObject.prototype.update = function(delta) {
      return this.children.update(delta);
    };

    /*
    @description Add child object
    @param {Object} object Object to be added
    */


    GameObject.prototype.add = function(object) {
      return this.children.add(object);
    };

    /*
    @description Remove child object
    @param {Object} objectOrIndex Object or index of object to be removed
    */


    GameObject.prototype.remove = function(objectOrIndex) {
      return this.children.remove(objectOrIndex);
    };

    /*
    @description Activate child object
    @param {Object} objectOrIndex Object or index of object to be activated
    */


    GameObject.prototype.activate = function(objectOrIndex) {
      return this.children.activate(objectOrIndex);
    };

    /*
    @description Deactivate child object
    @param {Object} objectOrIndex Object or index of object to be deactivated
    */


    GameObject.prototype.deactivate = function(objectOrIndex) {
      return this.children.deactivate(objectOrIndex);
    };

    return GameObject;

  })();

  module.exports = GameObject;

}).call(this);


},{"./pool.coffee":7}],6:[function(require,module,exports){
(function() {
  var Label, Shape,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Shape = require('./shape.coffee');

  Label = (function(_super) {
    __extends(Label, _super);

    function Label(args) {
      if (args == null) {
        args = {};
      }
      Label.__super__.constructor.call(this, args);
      this._font = {
        size: 10,
        family: 'monospace'
      };
      this._text = 'text goes here';
      this._alignment = 'center';
      this.fixed = true;
      if (args.font) {
        this.font = args.font;
      }
      if (args.text) {
        this.text = args.text;
      }
      if (args.alignment) {
        this.alignment = args.alignment;
      }
      this.anchor = {
        x: this.size.width / 2,
        y: this.size.height / 2
      };
    }

    /*
    @description Draw object onto internal <canvas> cache
    */


    Label.prototype.drawCanvasCache = function() {
      var Arcadia, context, element;
      if (this.canvas === void 0) {
        return;
      }
      Arcadia = require('./arcadia.coffee');
      context = this.canvas.getContext('2d');
      element = document.getElementById('text-dimensions');
      if (!element) {
        element = document.createElement('div');
        element['id'] = 'text-dimensions';
        element.style['position'] = 'absolute';
        element.style['top'] = '-9999px';
        document.body.appendChild(element);
      }
      element.style['font'] = this.font;
      element.style['line-height'] = 1;
      element.innerHTML = this.text;
      this.size.width = element.offsetWidth;
      this.size.height = element.offsetHeight;
      this.anchor = {
        x: this.size.width / 2,
        y: this.size.height / 2
      };
      this.canvas.width = this.size.width + this._border.width + Math.abs(this._shadow.x) + this._shadow.blur;
      this.canvas.height = this.size.height + this._border.width + Math.abs(this._shadow.y) + this._shadow.blur;
      context.font = this.font;
      context.textAlign = this.alignment;
      context.textBaseline = 'middle';
      this.setAnchorPoint();
      if (this.debug) {
        context.lineWidth = 1;
        context.strokeStyle = '#f00';
        context.strokeRect(0, 0, this.canvas.width, this.canvas.height);
        context.arc(this.anchor.x, this.anchor.y, 3, 0, 2 * Math.PI, false);
        context.stroke();
      }
      context.translate(this.anchor.x, this.anchor.y);
      if (this._shadow.x !== 0 || this._shadow.y !== 0 || this._shadow.blur !== 0) {
        context.shadowOffsetX = this._shadow.x;
        context.shadowOffsetY = this._shadow.y;
        context.shadowBlur = this._shadow.blur;
        context.shadowColor = this._shadow.color;
      }
      if (this._color) {
        context.fillStyle = this._color;
        context.fillText(this.text, 0, 0, Arcadia.WIDTH);
      }
      if (this._shadow.x !== 0 || this._shadow.y !== 0 || this._shadow.blur !== 0) {
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = 0;
      }
      if (this._border.width && this._border.color) {
        context.lineWidth = this._border.width;
        context.strokeStyle = this._border.color;
        return context.strokeText(this.text, 0, 0, Arcadia.WIDTH);
      }
    };

    /*
    @description Getter/setter for font
    TODO: Handle bold text
    */


    Label.property('font', {
      get: function() {
        return "" + this._font.size + " " + this._font.family;
      },
      set: function(font) {
        var values;
        values = font.match(/^(.+) (.+)$/);
        if (values.length === 3) {
          this._font.size = values[1];
          this._font.family = values[2];
          return this.dirty = true;
        } else {
          throw new Error('Use format "(size)px (font-family)" when setting Label font');
        }
      }
    });

    Label.property('text', {
      get: function() {
        return this._text;
      },
      set: function(value) {
        this._text = value;
        return this.dirty = true;
      }
    });

    Label.property('alignment', {
      get: function() {
        return this._alignment;
      },
      set: function(value) {
        this._alignment = value;
        return this.dirty = true;
      }
    });

    return Label;

  })(Shape);

  module.exports = Label;

}).call(this);


},{"./arcadia.coffee":1,"./shape.coffee":9}],7:[function(require,module,exports){
/*
@description One possible way to store common recyclable objects.
Assumes the objects you add will have an `active` property, and optionally an
`activate()` method which resets the object's state. Inspired by Programming
Linux Games (http://en.wikipedia.org/wiki/Programming_Linux_Games)
*/


(function() {
  var Pool;

  Pool = (function() {
    function Pool() {
      this.children = [];
      this.length = 0;
      this.tmp = null;
      this.factory = null;
    }

    Pool.prototype.at = function(index) {
      if (index >= this.length) {
        return null;
      }
      return this.children[index];
    };

    /*
    @description Push an object into the recycle pool
    */


    Pool.prototype.add = function(object) {
      this.children.push(object);
      if (this.length < this.children.length) {
        this.tmp = this.children[this.children.length - 1];
        this.children[this.children.length - 1] = this.children[this.length];
        this.children[this.length] = this.tmp;
      }
      this.length += 1;
      return this.length;
    };

    /*
    @description Remove an object from the recycle pool
    */


    Pool.prototype.remove = function(objectOrIndex) {
      var index, object;
      if (objectOrIndex === void 0) {
        throw 'Must specify an object/index to remove';
      }
      index = typeof objectOrIndex !== 'number' ? this.children.indexOf(objectOrIndex) : objectOrIndex;
      if (index === -1) {
        return;
      }
      object = this.children.splice(index, 1)[0];
      if (typeof object.destroy === 'function') {
        object.destroy();
      }
      if (index < this.length) {
        this.length -= 1;
      }
      return object;
    };

    /*
    @description Get an active object by either reference or index
    */


    Pool.prototype.activate = function(objectOrIndex) {
      var index;
      if (objectOrIndex !== void 0) {
        index = typeof objectOrIndex !== 'number' ? this.children.indexOf(objectOrIndex) : objectOrIndex;
        if (!((this.children.length > index && index >= this.length))) {
          return null;
        }
        this.tmp = this.children[this.length];
        this.children[this.length] = this.children[index];
        this.children[index] = this.tmp;
        this.tmp = null;
        this.length += 1;
        return this.children[this.length - 1];
      }
      if (objectOrIndex === void 0 && this.length < this.children.length) {
        this.length += 1;
        if (typeof this.children[this.length - 1].reset === 'function') {
          this.children[this.length - 1].reset();
        }
        return this.children[this.length - 1];
      }
      if (typeof this.factory !== 'function') {
        throw 'Pools need a factory function';
      }
      this.children.push(this.factory());
      this.length += 1;
      return this.children[this.length - 1];
    };

    /*
    @description Deactivate an active object at a particular object/index
    */


    Pool.prototype.deactivate = function(objectOrIndex) {
      var index;
      index = typeof objectOrIndex !== 'number' ? this.children.indexOf(objectOrIndex) : objectOrIndex;
      if (index >= this.length || index < 0) {
        return null;
      }
      this.tmp = this.children[index];
      this.children[index] = this.children[this.length - 1];
      this.children[this.length - 1] = this.tmp;
      this.tmp = null;
      this.length -= 1;
      return this.children[this.length];
    };

    /*
    @description Deactivate all child objects
    */


    Pool.prototype.deactivateAll = function() {
      return this.length = 0;
    };

    /*
    @description Activate all child objects
    */


    Pool.prototype.activateAll = function() {
      this.length = this.children.length;
      while (this.length--) {
        this.tmp = this.children[this.length];
        if (typeof this.tmp.reset === 'function') {
          this.tmp.reset();
        }
      }
      return this.length = this.children.length;
    };

    /*
    @description Passthrough method to update active child objects
    */


    Pool.prototype.update = function(delta) {
      this.tmp = this.length;
      while (this.tmp--) {
        this.children[this.tmp].update(delta);
      }
    };

    /*
    @description Passthrough method to draw active child objects
    */


    Pool.prototype.draw = function(context, offsetX, offsetY) {
      if (offsetX == null) {
        offsetX = 0;
      }
      if (offsetY == null) {
        offsetY = 0;
      }
      this.tmp = this.length;
      while (this.tmp--) {
        this.children[this.tmp].draw(context, offsetX, offsetY);
      }
    };

    return Pool;

  })();

  module.exports = Pool;

}).call(this);


},{}],8:[function(require,module,exports){
(function() {
  var GameObject, Scene,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  GameObject = require('./gameobject.coffee');

  Scene = (function(_super) {
    __extends(Scene, _super);

    function Scene() {
      var Arcadia;
      Scene.__super__.constructor.apply(this, arguments);
      this.canvas = document.createElement('canvas');
      this.context = this.canvas.getContext('2d');
      Arcadia = require('./arcadia.coffee');
      this.camera = {
        target: null,
        viewport: {
          width: Arcadia.WIDTH,
          height: Arcadia.HEIGHT
        },
        bounds: {
          top: 0,
          bottom: Arcadia.HEIGHT,
          left: 0,
          right: Arcadia.WIDTH
        },
        position: {
          x: Arcadia.WIDTH / 2,
          y: Arcadia.HEIGHT / 2
        }
      };
    }

    /*
     * @description Update the camera if necessary
     * @param {Number} delta
    */


    Scene.prototype.update = function(delta) {
      Scene.__super__.update.call(this, delta);
      if (this.camera.target !== null) {
        this.camera.position.x = this.camera.target.position.x;
        this.camera.position.y = this.camera.target.position.y;
        if (this.camera.position.x < this.camera.bounds.left + this.camera.viewport.width / 2) {
          this.camera.position.x = this.camera.bounds.left + this.camera.viewport.width / 2;
        } else if (this.camera.position.x > this.camera.bounds.right - this.camera.viewport.width / 2) {
          this.camera.position.x = this.camera.bounds.right - this.camera.viewport.width / 2;
        }
        if (this.camera.position.y < this.camera.bounds.top + this.camera.viewport.height / 2) {
          return this.camera.position.y = this.camera.bounds.top + this.camera.viewport.height / 2;
        } else if (this.camera.position.y > this.camera.bounds.bottom - this.camera.viewport.height / 2) {
          return this.camera.position.y = this.camera.bounds.bottom - this.camera.viewport.height / 2;
        }
      }
    };

    /*
     * @description Clear context, then re-draw all child objects
     * @param {CanvasRenderingContext2D} context
    */


    Scene.prototype.draw = function(context) {
      if (this.color) {
        context.fillStyle = this.color;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
      } else {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      }
      return Scene.__super__.draw.call(this, context, this.camera.viewport.width / 2 - this.camera.position.x, this.camera.viewport.height / 2 - this.camera.position.y);
    };

    /*
    @description Move scene's <canvas> into place
    */


    Scene.prototype.transition = function() {
      return console.log('Scene#transition');
    };

    /*
    TODO: Handle removing event listeners, etc.?
    */


    Scene.prototype.destroy = function() {
      return console.log('Scene#destroy');
    };

    /*
    @description Getter/setter for camera target
    */


    Scene.property('target', {
      get: function() {
        return this.camera.target;
      },
      set: function(shape) {
        if (!(shape != null ? shape.position : void 0)) {
          return;
        }
        this.camera.target = shape;
        this.camera.position.x = shape.position.x;
        return this.camera.position.y = shape.position.y;
      }
    });

    return Scene;

  })(GameObject);

  module.exports = Scene;

}).call(this);


},{"./arcadia.coffee":1,"./gameobject.coffee":5}],9:[function(require,module,exports){
(function() {
  var GameObject, Shape,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  GameObject = require('./gameobject.coffee');

  Shape = (function(_super) {
    __extends(Shape, _super);

    /*
    @description Shape constructor
    @param {Object} args Object representing shape options
    */


    function Shape(args) {
      if (args == null) {
        args = {};
      }
      Shape.__super__.constructor.call(this, args);
      this.canvas = document.createElement('canvas');
      this._color = '#fff';
      this._border = {
        width: 0,
        color: '#fff'
      };
      this._shadow = {
        x: 0,
        y: 0,
        blur: 0,
        color: '#fff'
      };
      this._vertices = 4;
      this._size = {
        width: 10,
        height: 10
      };
      this.dirty = true;
      this.velocity = args.velocity || {
        x: 0,
        y: 0
      };
      this.acceleration = args.acceleration || {
        x: 0,
        y: 0
      };
      this.speed = args.speed || 1;
      this.debug = args.debug || false;
      this.fixed = args.fixed || false;
      this.angularVelocity = args.angularVelocity || 0;
      if (args.color) {
        this.color = args.color;
      }
      if (args.border) {
        this.border = args.border;
      }
      if (args.shadow) {
        this.shadow = args.shadow;
      }
      if (args.vertices) {
        this.vertices = args.vertices;
      }
      if (args.size) {
        this.size = args.size;
      }
      if (args.path) {
        this.path = args.path;
      }
      this.anchor = {
        x: this.size.width / 2,
        y: this.size.height / 2
      };
    }

    /*
    @description Getter/setter for color
    */


    Shape.property('color', {
      get: function() {
        return this._color;
      },
      set: function(color) {
        this._color = color;
        return this.dirty = true;
      }
    });

    /*
    @description Getter/setter for border
    */


    Shape.property('border', {
      get: function() {
        return "" + this._border.width + "px " + this._border.color;
      },
      set: function(border) {
        var values;
        values = border.match(/^(\d+px) (.+)$/);
        if ((values != null ? values.length : void 0) === 3) {
          this._border.width = parseInt(values[1], 10);
          this._border.color = values[2];
          return this.dirty = true;
        } else {
          return console.warn('Use format "(width)px (color)" when setting borders');
        }
      }
    });

    /*
    @description Getter/setter for shadow
    */


    Shape.property('shadow', {
      get: function() {
        return "" + this._shadow.x + "px " + this._shadow.y + "px " + this._shadow.blur + "px " + this._shadow.color;
      },
      set: function(shadow) {
        var values;
        values = shadow.match(/^(.+) (.+) (.+) (.+)$/);
        if ((values != null ? values.length : void 0) === 5) {
          this._shadow.x = parseInt(values[1], 10);
          this._shadow.y = parseInt(values[2], 10);
          this._shadow.blur = parseInt(values[3], 10);
          this._shadow.color = values[4];
          return this.dirty = true;
        } else {
          return console.warn('Use format "(x)px (y)px (blur)px (color)" when setting shadows');
        }
      }
    });

    Shape.property('vertices', {
      get: function() {
        return this._vertices;
      },
      set: function(verticies) {
        this._vertices = verticies;
        return this.dirty = true;
      }
    });

    Shape.property('size', {
      get: function() {
        return this._size;
      },
      set: function(size) {
        this._size = {
          width: size.width,
          height: size.height
        };
        return this.dirty = true;
      }
    });

    /*
    @description Getter/setter for path
    */


    Shape.property('path', {
      get: function() {
        return this._path;
      },
      set: function(path) {
        this._path = path;
        return this.dirty = true;
      }
    });

    /*
    @description Draw object onto internal <canvas> cache
    */


    Shape.prototype.drawCanvasCache = function() {
      var context;
      if (this.canvas === void 0) {
        return;
      }
      this.canvas.width = this.size.width + this._border.width + Math.abs(this._shadow.x) + this._shadow.blur;
      this.canvas.height = this.size.height + this._border.width + Math.abs(this._shadow.y) + this._shadow.blur;
      this.setAnchorPoint();
      context = this.canvas.getContext('2d');
      context.lineJoin = 'miter';
      context.beginPath();
      if (this.debug) {
        context.lineWidth = 1;
        context.strokeStyle = '#f00';
        context.strokeRect(0, 0, this.canvas.width, this.canvas.height);
        context.arc(this.anchor.x, this.anchor.y, 3, 0, 2 * Math.PI, false);
        context.stroke();
      }
      context.translate(this.anchor.x, this.anchor.y);
      if (this.path) {
        this._path(context);
      } else {
        switch (this.vertices) {
          case 2:
            context.moveTo(-this.size.width / 2, -this.size.height / 2);
            context.lineTo(this.size.width / 2, this.size.height / 2);
            break;
          case 3:
            context.moveTo(0, -this.size.height / 2);
            context.lineTo(this.size.width / 2, this.size.height / 2);
            context.lineTo(-this.size.width / 2, this.size.height / 2);
            context.lineTo(0, -this.size.height / 2);
            break;
          case 4:
            context.moveTo(-this.size.width / 2, -this.size.height / 2);
            context.lineTo(this.size.width / 2, -this.size.height / 2);
            context.lineTo(this.size.width / 2, this.size.height / 2);
            context.lineTo(-this.size.width / 2, this.size.height / 2);
            context.lineTo(-this.size.width / 2, -this.size.height / 2);
            break;
          default:
            context.arc(0, 0, this.size.width / 2, 0, 2 * Math.PI);
        }
      }
      context.closePath();
      if (this._shadow.x !== 0 || this._shadow.y !== 0 || this._shadow.blur !== 0) {
        context.shadowOffsetX = this._shadow.x;
        context.shadowOffsetY = this._shadow.y;
        context.shadowBlur = this._shadow.blur;
        context.shadowColor = this._shadow.color;
      }
      if (this._color) {
        context.fillStyle = this._color;
        context.fill();
      }
      if (this._shadow.x !== 0 || this._shadow.y !== 0 || this._shadow.blur !== 0) {
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = 0;
      }
      if (this._border.width && this._border.color) {
        context.lineWidth = this._border.width;
        context.strokeStyle = this._border.color;
        context.stroke();
      }
      return this.dirty = false;
    };

    /*
    @description Find the midpoint of the shape
    */


    Shape.prototype.setAnchorPoint = function() {
      var x, y;
      x = this.size.width / 2 + this._border.width / 2;
      y = this.size.height / 2 + this._border.width / 2;
      if (this._shadow.blur > 0) {
        x += this._shadow.blur / 2;
        y += this._shadow.blur / 2;
      }
      if (this._shadow.x < 0) {
        x -= this._shadow.x;
      }
      if (this._shadow.y < 0) {
        y -= this._shadow.y;
      }
      this.anchor.x = x;
      return this.anchor.y = y;
    };

    /*
    @description Draw object
    @param {CanvasRenderingContext2D} context
    */


    Shape.prototype.draw = function(context, offsetX, offsetY) {
      if (offsetX == null) {
        offsetX = 0;
      }
      if (offsetY == null) {
        offsetY = 0;
      }
      if (this.fixed) {
        offsetX = offsetY = 0;
      }
      context.translate(this.position.x + offsetX, this.position.y + offsetY);
      if (this.scale !== 1) {
        context.scale(this.scale, this.scale);
      }
      if (this.rotation !== 0 && this.rotation !== Math.PI * 2) {
        context.rotate(this.rotation);
      }
      if (this.alpha < 1) {
        context.globalAlpha = this.alpha;
      }
      if (this.dirty) {
        this.drawCanvasCache();
      }
      context.drawImage(this.canvas, -this.anchor.x, -this.anchor.y);
      if (this.rotation !== 0 && this.rotation !== Math.PI * 2) {
        context.rotate(-this.rotation);
      }
      context.translate(-this.position.x - offsetX, -this.position.y - offsetY);
      if (this.scale !== 1) {
        context.scale(1, 1);
      }
      if (this.alpha < 1) {
        context.globalAlpha = 1;
      }
      return Shape.__super__.draw.call(this, context, this.position.x + offsetX, this.position.y + offsetY);
    };

    /*
    @description Update object
    @param {Number} delta Time since last update (in seconds)
    */


    Shape.prototype.update = function(delta) {
      Shape.__super__.update.call(this, delta);
      this.velocity.x += this.acceleration.x;
      this.velocity.y += this.acceleration.y;
      this.position.x += this.velocity.x * this.speed * delta;
      this.position.y += this.velocity.y * this.speed * delta;
      return this.rotation += this.angularVelocity * delta;
    };

    /*
     * @description Basic collision detection
     * @param {Shape} other Shape object to test collision with
    */


    Shape.prototype.collidesWith = function(other) {
      if (this.vertices === 4) {
        return Math.abs(this.position.x - other.position.x) < this.size / 2 + other.size / 2 && Math.abs(this.position.y - other.position.y) < this.size / 2 + other.size / 2;
      } else {
        return Math.sqrt(Math.pow(other.position.x - this.position.x, 2) + Math.pow(other.position.y - this.position.y, 2)) < this.size / 2 + other.size / 2;
      }
    };

    return Shape;

  })(GameObject);

  module.exports = Shape;

}).call(this);


},{"./gameobject.coffee":5}],10:[function(require,module,exports){
(function() {
  var GameObject, Sprite,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  GameObject = require('./gameobject.coffee');

  Sprite = (function(_super) {
    __extends(Sprite, _super);

    /*
    @description Sprite constructor
    @param {Object} options Possible keys: x, y, size, imgsrc
    */


    function Sprite(options) {
      if (options == null) {
        options = {};
      }
      Sprite.__super__.constructor.call(this, options.x, options.y);
      this.size = options.size;
      this.speed = 1;
      this.velocity = {
        x: 0,
        y: 0
      };
      this.img = new Image();
      this.img.src = options.imgsrc;
    }

    /*
    @description Draw object
    @param {CanvasRenderingContext2D} context
    */


    Sprite.prototype.draw = function(context, offsetX, offsetY) {
      if (offsetX == null) {
        offsetX = 0;
      }
      if (offsetY == null) {
        offsetY = 0;
      }
      if (this.fixed) {
        offsetX = offsetY = 0;
      }
      Sprite.__super__.draw.call(this, context, this.position.x + offsetX, this.position.y + offsetY);
      context.save();
      context.translate(this.position.x + offsetX, this.position.y + offsetY);
      if (this.scale !== 1) {
        context.scale(this.scale, this.scale);
      }
      if (this.rotation !== 0 && this.rotation !== Math.PI * 2) {
        context.rotate(this.rotation);
      }
      context.drawImage(this.img, 0, 0);
      return context.restore();
    };

    /*
    @description Update object
    @param {Number} delta Time since last update (in seconds)
    */


    Sprite.prototype.update = function(delta) {
      Sprite.__super__.update.call(this, delta);
      this.position.x += this.velocity.x * this.speed * delta;
      return this.position.y += this.velocity.y * this.speed * delta;
    };

    /*
    @description Basic collision detection
    @param {Sprite} other Sprite object to test collision with
    */


    Sprite.prototype.collidesWith = function(other) {
      if (this.vertices === 4) {
        return Math.abs(this.position.x - other.position.x) < this.size / 2 + other.size / 2 && Math.abs(this.position.y - other.position.y) < this.size / 2 + other.size / 2;
      } else {
        return Math.sqrt(Math.pow(other.position.x - this.position.x, 2) + Math.pow(other.position.y - this.position.y, 2)) < this.size / 2 + other.size / 2;
      }
    };

    return Sprite;

  })(GameObject);

  module.exports = Sprite;

}).call(this);


},{"./gameobject.coffee":5}]},{},[1])
(1)
});
;