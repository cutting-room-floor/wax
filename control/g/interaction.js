wax = wax || {};
wax.g = wax.g || {};

wax.g.interaction = function() {
    var dirty = false, _grid, map;

    function setdirty() { dirty = true; }

    function grid() {

        if (!dirty && _grid) {
            return _grid;
        } else {
            _grid = [];
            var zoom = map.getZoom();
            var mapOffset = wax.u.offset(map.getDiv());
            var get = function(mapType) {
                if (!mapType.interactive) return;
                for (var key in mapType.cache) {
                    if (key.split('/')[0] != zoom) continue;
                    var tileOffset = wax.u.offset(mapType.cache[key]);
                    _grid.push([
                        tileOffset.top - mapOffset.top,
                        tileOffset.left - mapOffset.left,
                        mapType.cache[key]
                    ]);
                }
            };
            // Iterate over base mapTypes and overlayMapTypes.
            for (var i in map.mapTypes) get(map.mapTypes[i]);
            map.overlayMapTypes.forEach(get);
        }
        return _grid;
    }

    function attach(x) {
        if (!arguments.length) return map;
        map = x;
        google.maps.event.addListener(map, 'tileloaded',
            setdirty);
        google.maps.event.addListener(map, 'idle',
            setdirty);
    }

    return wax.interaction()
        .attach(attach)
        .parent(function() {
          return map.getDiv();
        })
        .grid(grid);
};
