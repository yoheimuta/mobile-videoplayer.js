var MVPlayer = window.MVPlayer = window.MVPlayer || {};

MVPlayer.Util = (function() {
    var Util = {};

    Util.getFromDataSet = function(element, attr_name) {
        return element.getAttribute("data-" + attr_name);
    };

    Util.getElementsByClassName = function(element, search) {
        if (document.getElementsByClassName) { // Modern
            return element.getElementsByClassName(search);
        }

        if (document.querySelectorAll) { // IE8
            return element.querySelectorAll("." + search);
        }

        // IE6, IE7
        var ret = [];
        var elements = element.getElementsByTagName("*");
        var pattern  = new RegExp("(^|\\s)" + search + "(\\s|$)");
        for (var i = 0; i < elements.length; i++) {
            if ( pattern.test(elements[i].className) ) {
                ret.push(elements[i]);
            }
        }
        return ret;
    };

    Util.addEventListener = function(element, name, callback, use_capture) {
        if(window.addEventListener) { // Modern
            element.addEventListener(name, callback, use_capture);
            return;
        }

        element.attachEvent("on" + name, function(e){ // ~ IE8
            e = e || window.event;
            e.preventDefault  = e.preventDefault  || function(){e.returnValue = false;};
            e.stopPropagation = e.stopPropagation || function(){e.cancelBubble = true;};
            callback.call(element, e);
        });
    };

    return Util;
})();
