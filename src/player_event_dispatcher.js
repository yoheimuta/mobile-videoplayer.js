var MVPlayer = window.MVPlayer = window.MVPlayer || {};

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
