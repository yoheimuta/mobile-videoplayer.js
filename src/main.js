var MVPlayer = typeof window.MVPlayer === 'undefined' ? {} : window.MVPlayer;
window.MVPlayer = MVPlayer;

MVPlayer.Strip = (function() {
    function Strip(width, height, element) {
        this.width       = width;
        this.height      = height;
        this.image_url   = element.dataset.url;
        this.frame_count = parseInt(element.dataset.framesCount, 10)
        this.element     = element;

        this._initStyles();
        this._initFrames();
        this._initStripImages();
    }

    Strip.prototype._initStyles = function() {
        this.element.style.position = "absolute";
    }

    Strip.prototype._initFrames = function() {
        this.frames = [];
        for (var i = 0; i < this.frame_count; i++) {
            var frame = {top: this.height * i};
            this.frames.push(frame);
        }
        this.frame_index = 0;
    }

    Strip.prototype._initStripImages = function() {
        this.imageElement = this.element.getElementsByTagName("img")[0];
        this.imageElement.style.width  = this.width + "px";
        this.imageElement.style.height = (this.height * this.frame_count) + "px";
    }

    Strip.prototype.activate = function() {
        this.element.style.display = "";
    };

    Strip.prototype.deactivate = function() {
        this.element.style.display = "none";
        this.reset();
    };

    Strip.prototype.isFinished = function() {
        return this.frame_index === this.frame_count - 1;
    };

    Strip.prototype.load = function(callback) {
        this.imageElement.addEventListener("load", callback, false);
        this.imageElement.src = this.image_url;
    };

    Strip.prototype.move = function() {
        this.frame_index++;
    };

    Strip.prototype.show = function() {
        var current = this.frames[this.frame_index];
        this.element.style.top = (current.top * -1) + "px";
    };

    Strip.prototype.reset = function() {
        this.frame_index = 0;
        return this.show();
    };

    return Strip;
})();

MVPlayer.MultiStrip = (function() {
    function MultiStrip(width, height, elements) {
        this.strips = [];
        for (var i = 0; i < elements.length; i++) {
            var strip = new MVPlayer.Strip(width, height, elements[i]);
            this.strips.push(strip);
        }
        this.strip_index           = 0;
        this.strip_loaded_count    = 0;
        this.strip_already_loading = false;
    }

    MultiStrip.prototype.getCurrentFrameIndex = function() {
        var index = 0;
        for (var i = 0; i < this.strips.length; i++) {
            if (this.strip_index < i) {
                break;
            }

            var strip = this.strips[i];
            if (this.strip_index === i) {
                index += strip.frame_index + 1;
            } else {
                index += strip.frame_count;
            }
        }
        return index;
    };

    MultiStrip.prototype.getTotalFrameCount = function() {
        var total = 0;
        for (var i = 0; i < this.strips.length; i++) {
            total += this.strips[i].frame_count;
        }
        return total;
    };

    MultiStrip.prototype.isInit = function() {
        return this.getCurrentFrameIndex() === 1;
    };

    MultiStrip.prototype.isFinished = function() {
        return this.getCurrentFrameIndex() === this.getTotalFrameCount();
    };

    MultiStrip.prototype.load = function(callback) {
        if (this.strip_loaded_count === this.strips.length) {
            callback(null);
            return;
        }

        if (this.strip_already_loading) {
            callback("already");
            return;
        }

        this.strip_already_loading = true;

        for (var i = 0; i < this.strips.length; i++) {
            var that = this;
            this.strips[i].load(function() {
                that.strip_loaded_count++;
                if (that.strip_loaded_count === that.strips.length) {
                    callback(null);
                }
            });
        }
    };

    MultiStrip.prototype.move = function() {
        var current = this.strips[this.strip_index];
        if (current.isFinished()) {
            current.deactivate();

            if (this.strip_index === this.strips.length - 1) {
                return;
            }

            current = this.strips[++this.strip_index];
            current.activate();
        }
        current.move();
    };

    MultiStrip.prototype.show = function() {
        var current = this.strips[this.strip_index];
        current.show();
    };

    MultiStrip.prototype.reset = function() {
        var current = this.strips[this.strip_index];
        current.deactivate();

        this.strip_index = 0;
        var first = this.strips[this.strip_index];
        first.activate();
    };

    return MultiStrip;
})();

MVPlayer.Player = (function() {
    function Player(element) {
        var d = element.dataset;
        var w = parseInt(d.frameWidth, 10);
        var h = parseInt(d.frameHeight, 10);

        this.movie = new MVPlayer.MultiStrip(w, h, element.getElementsByClassName("strip"));
        this.dispatcher = new MVPlayer.PlayerEventDispatcher();

        this.fps = parseInt(d.fps, 10);

        this.element = element;
        this.element.style.width    = w + "px";
        this.element.style.height   = h + "px";
        this.element.style.position = "relative";
        this.element.style.overflow = "hidden";
    }

    Player.prototype.load = function(callback) {
        this.movie.load(function(err) {
            callback(err);
        });
    };

    Player.prototype.play = function() {
        if (this.timerId) {
            return;
        }

        if (this.movie.isInit()) {
            this.dispatcher.didStart();
        } else {
            this.dispatcher.didResume();
        }

        this.timerId = setInterval((function(that) {
            return function() {
                if (that.movie.isFinished()) {
                    that.pause();
                    that.movie.reset();

                    that.dispatcher.didFinish();
                } else {
                    that.movie.show();
                    that.movie.move();

                    var current = that.movie.getCurrentFrameIndex();
                    var total   = that.movie.getTotalFrameCount();
                    if (current === Math.floor(total / 4)) {
                        that.dispatcher.firstQuartile();
                    }
                    if (current === Math.floor(total / 2)) {
                        that.dispatcher.half();
                    }
                    if (current === Math.floor(total / 4 * 3)) {
                        that.dispatcher.thirdQuartile();
                    }
                }
            };
        })(this), 1000 / this.fps);
    };

    Player.prototype.pause = function() {
        if (!this.timerId) {
            return;
        }

        if (!this.movie.isFinished()) {
            this.dispatcher.didPause();
        }

        clearInterval(this.timerId);
        this.timerId = void 0;
    };

    return Player;
})();

MVPlayer.AppearanceDetector = (function() {
    function AppearanceDetector(element, top_margin, bottom_margin, didAppear, didDisappear) {
        this.element       = element;
        this.top_margin    = top_margin;
        this.bottom_margin = bottom_margin;
        this.didAppear     = didAppear;
        this.didDisappear  = didDisappear;

        this.wasVisible    = false;

        this.detect();
    }

    AppearanceDetector.prototype._topVisible = function() {
        var y = this.element.getBoundingClientRect().top;
        return y + this.top_margin > 0;
    };

    AppearanceDetector.prototype._bottomVisible = function() {
        var y = this.element.getBoundingClientRect().bottom;
        var height = window.innerHeight;
        return y - this.bottom_margin < height;
    };

    AppearanceDetector.prototype._isVisible = function() {
        return this._topVisible() && this._bottomVisible();
    };

    AppearanceDetector.prototype.detect = function() {
        var isVisible = this._isVisible();
        if (isVisible === this.wasVisible) {
            return;
        }

        if (isVisible && !this.wasVisible) {
            this.didAppear();
        } else {
            this.didDisappear();
        }

        this.wasVisible = isVisible;
    };

    return AppearanceDetector;
})();

MVPlayer.PlayerEventDispatcher = (function() {
    function PlayerEventDispatcher() {
    }

    PlayerEventDispatcher.prototype.didStart = function() {
        console.log("didStart");
    };

    PlayerEventDispatcher.prototype.didResume = function() {
        console.log("didResume");
    };

    PlayerEventDispatcher.prototype.didFinish = function() {
        console.log("didFinish");
    };

    PlayerEventDispatcher.prototype.firstQuartile = function() {
        console.log("firstQuartile");
    };

    PlayerEventDispatcher.prototype.half = function() {
        console.log("half");
    };

    PlayerEventDispatcher.prototype.thirdQuartile = function() {
        console.log("thirdQuartile");
    };

    PlayerEventDispatcher.prototype.didPause = function() {
        console.log("didPause");
    };

    return PlayerEventDispatcher;
})();

MVPlayer.Controller = (function() {
    var Controller = {};

    var is_appear  = false;

    function _play(player, loadElement) {
        is_appear = true;

        player.load(function(err) {
            if (!is_appear || err) {
                return;
            }

            if (loadElement) {
                loadElement.style.display = "none";
            }

            player.element.style.display = "";
            player.play();
        });
    }

    function _finish(player) {
        is_appear = false;

        player.pause();
    }

    function _setupEvents(player, loadElement, replayElement, doneElement) {
        (function(didFinish) {
            player.dispatcher.didFinish = function() {
                didFinish.call(player.dispatcher);

                if (!replayElement && !doneElement) {
                    player.play();
                    return;
                }

                player.element.style.display = "none";

                if (replayElement) {
                    replayElement.style.display = "";
                }
                if (doneElement) {
                    doneElement.style.display = "";
                }
            }
        })(player.dispatcher.didFinish);

        if (replayElement) {
            replayElement.addEventListener("click", function() {
                player.element.style.display = "";

                if (replayElement) {
                    replayElement.style.display = "none";
                }
                if (doneElement) {
                    doneElement.style.display = "none";
                }

                player.play();
            }, false);
        }

        var detector = new MVPlayer.AppearanceDetector(
            player.element, 90, 90,
            function() { _play(player, loadElement) },
            function() { _finish(player)}
        );
        document.addEventListener("scroll", function() {
            detector.detect();
        });
    }

    Controller.run = function(element) {
        var playElement = element.getElementsByClassName("play-scene")[0];
        if (!playElement) {
            return;
        }

        var player = new MVPlayer.Player(playElement);

        var loadElement   = element.getElementsByClassName("load-scene")[0];
        var replayElement = element.getElementsByClassName("replay-scene")[0];
        var doneElement   = element.getElementsByClassName("done-scene")[0];

        _setupEvents(player, loadElement, replayElement, doneElement);
    };

    return Controller;
})();
