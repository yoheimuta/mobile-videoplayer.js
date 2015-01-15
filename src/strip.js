var MVPlayer = window.MVPlayer = window.MVPlayer || {};

MVPlayer.Strip = (function() {
    function Strip(width, height, element) {
        this.width       = width;
        this.height      = height;
        this.image_url   = element.dataset.url;
        this.element     = element;

        this._initStyles();
        this._initStripImages();
    }

    function getNaturalHeight(element, url, callback) {
        if ("naturalHeight" in (new Image())) {
            callback(element.naturalHeight);
            return;
        }

        var tmp = new Image();
        tmp.src = url;
        tmp.addEventListener("load", function() {
            callback(tmp.height);
        });
    }

    Strip.prototype._initStyles = function() {
        this.element.style.position = "absolute";
    };

    Strip.prototype._initStripImages = function() {
        this.image_element = this.element.getElementsByTagName("img")[0];
        this.image_element.style.width  = this.width + "px";
    };

    Strip.prototype._initFrames = function() {
        this.frames = [];
        for (var i = 0; i < this.frame_count; i++) {
            var frame = {top: this.height * i};
            this.frames.push(frame);
        }
        this.frame_index = 0;
    };

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
        var that = this;
        this.image_element.addEventListener("load", function() {
            getNaturalHeight(this, that.image_url, function(nh) {
                that.image_element.style.height = nh + "px";
                that.frame_count = nh / that.height;
                that._initFrames();
                callback();
            });
        }, false);
        this.image_element.src = this.image_url;
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
