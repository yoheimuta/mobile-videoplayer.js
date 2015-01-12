var MVPlayer = window.MVPlayer = window.MVPlayer || {};

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

        var that = this;
        var strip_loaded_callback = function() {
            that.strip_loaded_count++;
            if (that.strip_loaded_count === that.strips.length) {
                callback(null);
            }
        };

        for (var i = 0; i < this.strips.length; i++) {
            this.strips[i].load(strip_loaded_callback);
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
