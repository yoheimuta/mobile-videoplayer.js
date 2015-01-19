"use strict";

var MVPlayer = window.MVPlayer = window.MVPlayer || {};

MVPlayer.AppearanceDetector = (function() {
    var Util = MVPlayer.Util;

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
        var y      = this.element.getBoundingClientRect().bottom;
        var height = Util.innerHeight();
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
