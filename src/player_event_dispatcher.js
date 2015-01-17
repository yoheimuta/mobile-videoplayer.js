"use strict";

var MVPlayer = window.MVPlayer = window.MVPlayer || {};

MVPlayer.PlayerEventDispatcher = (function() {
    function PlayerEventDispatcher(is_debug, did_start_url, did_resume_url, did_complete_url,
        first_quartile_url, midpoint_url, third_quartile_url, did_pause_url)
    {
        this.is_debug           = is_debug;
        this.did_start_url      = did_start_url;
        this.did_resume_url     = did_resume_url;
        this.did_complete_url   = did_complete_url;
        this.first_quartile_url = first_quartile_url;
        this.midpoint_url       = midpoint_url;
        this.third_quartile_url = third_quartile_url;
        this.did_pause_url      = did_pause_url;
    }

    function _sendBeacon(url) {
        if (!url) {
            return;
        }
        (new Image()).src = url;
    }

    PlayerEventDispatcher.prototype.log = function(msg) {
        if (!this.is_debug) {
            return;
        }
        if (!window.console) {
            return;
        }
        if (typeof window.console.log !== "function") {
            return;
        }
        console.log(msg);
    };

    PlayerEventDispatcher.prototype.didStart = function() {
        this.log("didStart");
        _sendBeacon(this.did_start_url);
    };

    PlayerEventDispatcher.prototype.didResume = function() {
        this.log("didResume");
        _sendBeacon(this.did_resume_url);
    };

    PlayerEventDispatcher.prototype.didComplete = function() {
        this.log("didComplete");
        _sendBeacon(this.did_complete_url);
    };

    PlayerEventDispatcher.prototype.firstQuartile = function() {
        this.log("firstQuartile");
        _sendBeacon(this.first_quartile_url);
    };

    PlayerEventDispatcher.prototype.midpoint = function() {
        this.log("midpoint");
        _sendBeacon(this.midpoint_url);
    };

    PlayerEventDispatcher.prototype.thirdQuartile = function() {
        this.log("thirdQuartile");
        _sendBeacon(this.third_quartile_url);
    };

    PlayerEventDispatcher.prototype.didPause = function() {
        this.log("didPause");
        _sendBeacon(this.did_pause_url);
    };

    return PlayerEventDispatcher;
})();
