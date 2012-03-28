wax = wax || {};
wax.mm = wax.mm || {};

wax.mm.interaction = function() {
    var dirty = false, _grid, map;

    function grid() {
        var zoomLayer = map.getLayerAt(0)
            .levels[Math.round(map.getZoom())];
        if (!dirty && _grid !== undefined && _grid.length) {
            return _grid;
        } else {
            _grid = (function(t) {
                var o = [];
                for (var key in t) {
                    if (t[key].parentNode === zoomLayer) {
                        var offset = wax.u.offset(t[key]);
                        o.push([
                            offset.top,
                            offset.left,
                            t[key]
                        ]);
                    }
                }
                return o;
            })(map.getLayerAt(0).tiles);
            return _grid;
        }
    }

    function attach(x) {
        if (!arguments.length) return map;
        map = x;
        function setdirty() { dirty = true; }
        var clearingEvents = ['zoomed', 'panned', 'centered',
            'extentset', 'resized', 'drawn'];
        for (var i = 0; i < clearingEvents.length; i++) {
            map.addCallback(clearingEvents[i], setdirty);
        }
    }

    return wax.interaction()
        .attach(attach)
        .parent(function() {
          return map.parent;
        })
        .grid(grid);
};
