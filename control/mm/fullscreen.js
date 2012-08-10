wax = wax || {};
wax.mm = wax.mm || {};

// Add zoom links, which can be styled as buttons, to a `modestmaps.Map`
// control. This function can be used chaining-style with other
// chaining-style controls.
wax.mm.fullscreen = function() {
    // true: fullscreen
    // false: minimized
    var fullscreened = false,
        fullscreen = {},
        a = document.createElement('a'),
        map,
        body = document.body,
        dimensions;

    a.className = 'map-fullscreen';
    a.href = '#fullscreen';
    // a.innerHTML = 'fullscreen';

    function click(e) {
        if (e) e.stop();
        if (fullscreened) {
            fullscreen.original();
        } else {
            fullscreen.full();
        }
    }

    fullscreen.map = function(x) {
        if (!arguments.length) return map;
        map = x;
        return fullscreen;
    };

    // Modest Maps demands an absolute height & width, and doesn't auto-correct
    // for changes, so here we save the original size of the element and
    // restore to that size on exit from fullscreen.
    fullscreen.add = function() {
        bean.add(a, 'click', click);
        map.parent.appendChild(a);
        return fullscreen;
    };

    fullscreen.remove = function() {
        bean.remove(a, 'click', click);
        if (a.parentNode) a.parentNode.removeChild(a);
        return fullscreen;
    };

    fullscreen.full = function() {
        if (fullscreened) { return; } else { fullscreened = true; }
        dimensions = map.dimensions;
        map.parent.className += ' map-fullscreen-map';
        body.className += ' map-fullscreen-view';
        map.dimensions = { x: map.parent.offsetWidth, y: map.parent.offsetHeight };
        map.draw();
        return fullscreen;
    };

    fullscreen.original = function() {
        if (!fullscreened) { return; } else { fullscreened = false; }
        map.parent.className = map.parent.className.replace(' map-fullscreen-map', '');
        body.className = body.className.replace(' map-fullscreen-view', '');
        map.dimensions = dimensions;
        map.draw();
        return fullscreen;
    };

    fullscreen.element = function() {
        return a;
    };

    fullscreen.appendTo = function(elem) {
        wax.u.$(elem).appendChild(a);
        return fullscreen;
    };

    return fullscreen;
};
