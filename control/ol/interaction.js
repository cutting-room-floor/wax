wax = wax || {};
wax.ol = wax.ol || {};

wax.ol.interaction = function() {
    var dirty = false, _grid, map;

    function setdirty() { dirty = true; }

    function getlayers() {
        var l = [];
        for (var i in map.layers) {
            // TODO: make better indication of whether
            // this is an interactive layer
            if ((map.layers[i].visibility === true) &&
                (map.layers[i].CLASS_NAME === 'Map.Layer')) {
              l.push(map.layers[i]);
            }
        }
        return l;
    }

    function grid() {
        if (!dirty && _grid) {
            return _grid;
        } else {
            _grid = [];
            var layers = getlayers();
            for (var j = 0; j < layers.length; j++) {
                for (var x = 0; x < layers[j].grid.length; x++) {
                    for (var y = 0; y < layers[j].grid[x].length; y++) {
                        var divpos;
                        if (layers[j].grid[x][y].imgDiv) {
                            divpos = wax.u.offset(layers[j].grid[x][y].imgDiv);
                        } else {
                            divpos = wax.u.offset(layers[j].grid[x][y].frame);
                        }
                        if (divpos &&
                            ((divpos.top < pos.y) &&
                             ((divpos.top + 256) > pos.y) &&
                             (divpos.left < pos.x) &&
                             ((divpos.left + 256) > pos.x))) {
                            tiles.push(layers[j].grid[x][y]);
                        }
                    }
                }
            }
            return tiles;
        }
    }

    function attach(x) {
        if (!arguments.length) return map;
        map = x;
        map.events.on({
            addlayer: setdirty,
            changelayer: setdirty,
            removelayer: setdirty,
            changebaselayer: setdirty
        });
    }

    function detach(x) {
        map.events.un({
            addlayer: setdirty,
            changelayer: setdirty,
            removelayer: setdirty,
            changebaselayer: setdirty
        });
    }

    return wax.interaction()
        .attach(attach)
        .parent(function() {
          return map.div;
        })
        .grid(grid);
};

