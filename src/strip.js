var MVPlayer = window.MVPlayer = window.MVPlayer || {};

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
