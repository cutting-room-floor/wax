wax = wax || {};
wax.mm = wax.mm || {};

// Fullscreen
// ----------
// A simple fullscreen control for Modest Maps

// Add zoom links, which can be styled as buttons, to a `modestmaps.Map`
// control. This function can be used chaining-style with other
// chaining-style controls.
wax.mm.fullscreen = function(map) {
    // true: fullscreen
    // false: minimized
    var fullscreened = false,
        fullscreen = {},
        a,
        body = document.body,
        smallSize;

    function click(e) {
        if (e) e.stop();
        if (fullscreened) {
            fullscreen.original();
        } else {
            fullscreen.full();
        }
    }

    function ss(w, h) {
        map.dimensions = new MM.Point(w, h);
        map.parent.style.width = Math.round(map.dimensions.x) + 'px';
        map.parent.style.height = Math.round(map.dimensions.y) + 'px';
        map.dispatchCallback('resized', map.dimensions);
    }

    // Modest Maps demands an absolute height & width, and doesn't auto-correct
    // for changes, so here we save the original size of the element and
    // restore to that size on exit from fullscreen.
    fullscreen.add = function(map) {
        a = document.createElement('a');
        a.className = 'map-fullscreen';
        a.href = '#fullscreen';
        a.innerHTML = 'fullscreen';
        bean.add(a, 'click', click);
        return this;
    };
    fullscreen.full = function() {
        if (fullscreened) { return; } else { fullscreened = true; }
        smallSize = [map.parent.offsetWidth, map.parent.offsetHeight];
        map.parent.className += ' map-fullscreen-map';
        body.className += ' map-fullscreen-view';
        ss(map.parent.offsetWidth, map.parent.offsetHeight);
    };
    fullscreen.original = function() {
        if (!fullscreened) { return; } else { fullscreened = false; }
        map.parent.className = map.parent.className.replace(' map-fullscreen-map', '');
        body.className = body.className.replace(' map-fullscreen-view', '');
        ss(smallSize[0], smallSize[1]);
    };
    fullscreen.appendTo = function(elem) {
        wax.u.$(elem).appendChild(a);
        return this;
    };

    return fullscreen.add(map);
};
