var MVPlayer = window.MVPlayer = window.MVPlayer || {};

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
