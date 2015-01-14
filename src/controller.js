var MVPlayer = window.MVPlayer = window.MVPlayer || {};

MVPlayer.Controller = (function() {
    var Controller = {};

    var _is_appear = false;
    var _is_debug  = false;

    function _play(player, loadElement) {
        _is_appear = true;

        player.load(function(err) {
            if (!_is_appear || err) {
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
        _is_appear = false;

        player.pause();
    }

    function _setupEvents(element, player, loadElement, replayElement, doneElement) {
        (function(didComplete) {
            player.dispatcher.didComplete = function() {
                didComplete.call(player.dispatcher);

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
            };
        })(player.dispatcher.didComplete);

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
            element, 90, 90,
            function() { _play(player, loadElement); },
            function() { _finish(player); }
        );
        document.addEventListener("scroll", function() {
            detector.detect();
        });
    }

    Controller.run = function(element, is_debug) {
        _is_debug = is_debug;

        var playElement = element.getElementsByClassName("play-scene")[0];
        if (!playElement) {
            return;
        }

        var player = new MVPlayer.Player(playElement, _is_debug);

        var loadElement   = element.getElementsByClassName("load-scene")[0];
        var replayElement = element.getElementsByClassName("replay-scene")[0];
        var doneElement   = element.getElementsByClassName("done-scene")[0];

        _setupEvents(element, player, loadElement, replayElement, doneElement);
    };

    return Controller;
})();
