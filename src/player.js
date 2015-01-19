"use strict";

var MVPlayer = window.MVPlayer = window.MVPlayer || {};

MVPlayer.Player = (function() {
    var Util = MVPlayer.Util;

    function Player(ele, is_debug) {

        var dattr = function(name) {
            return Util.getFromDataSet(ele, name);
        };

        var w = parseInt(dattr("frame-width"), 10);
        var h = parseInt(dattr("frame-height"), 10);

        this.movie = new MVPlayer.MultiStrip(w, h, Util.getElementsByClassName(ele, "strip"));
        this.dispatcher = new MVPlayer.PlayerEventDispatcher(is_debug, dattr("did-start-url"),
            dattr("did-resume-url"), dattr("did-complete-url"), dattr("first-quartile-url"),
            dattr("midpoint-url"), dattr("third-quartile-url"), dattr("did-pause-url"));

        this.fps = parseInt(dattr("fps"), 10);

        this.element = ele;
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

                    that.dispatcher.didComplete();
                } else {
                    that.movie.show();
                    that.movie.move();

                    var current = that.movie.getCurrentFrameIndex();
                    var total   = that.movie.getTotalFrameCount();
                    if (current === Math.floor(total / 4)) {
                        that.dispatcher.firstQuartile();
                    }
                    if (current === Math.floor(total / 2)) {
                        that.dispatcher.midpoint();
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
