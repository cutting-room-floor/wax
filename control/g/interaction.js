wax = wax || {};
wax.g = wax.g || {};

// A control that adds interaction to a google Map object.
//
// Takes an options object with the following keys:
//
// * `callbacks` (optional): an `out`, `over`, and `click` callback.
//   If not given, the `wax.tooltip` library will be expected.
// * `clickAction` (optional): **full** or **location**: default is
//   **full**.
wax.g.interaction = function(map, tilejson, options) {
    tilejson = tilejson || {};
    options = options || {};
    // Our GridManager (from `gridutil.js`). This will keep the
    // cache of grid information and provide friendly utility methods
    // that return `GridTile` objects instead of raw data.
    var interaction = {
        waxGM: new wax.GridManager(tilejson),

        // This requires wax.Tooltip or similar
        callbacks: options.callbacks || new wax.tooltip(),
        clickAction: options.clickAction || 'full',
        eventHandlers:{},

        // Attach listeners to the map
        add: function() {
            this.eventHandlers.tileloaded = google.maps.event.addListener(map, 'tileloaded',
                wax.util.bind(this.clearTileGrid, this));

            this.eventHandlers.idle = google.maps.event.addListener(map, 'idle',
                wax.util.bind(this.clearTileGrid, this));

            this.eventHandlers.mousemove = google.maps.event.addListener(map, 'mousemove',
                this.onMove());

            this.eventHandlers.click = google.maps.event.addListener(map, 'click',
                this.click());

            return this;
        },

        // Remove interaction events from the map.
        remove: function() {
            google.maps.event.removeListener(this.eventHandlers.tileloaded);
            google.maps.event.removeListener(this.eventHandlers.idle);
            google.maps.event.removeListener(this.eventHandlers.mousemove);
            google.maps.event.removeListener(this.eventHandlers.click);
            return this;
        },

        // Search through `.tiles` and determine the position,
        // from the top-left of the **document**, and cache that data
        // so that `mousemove` events don't always recalculate.
        getTileGrid: function() {
            // Get all 'marked' tiles, added by the `wax.g.MapType` layer.
            // Return an array of objects which have the **relative** offset of
            // each tile, with a reference to the tile object in `tile`, since the API
            // returns evt coordinates as relative to the map object.
            if (!this._getTileGrid) {
                this._getTileGrid = [];
                var zoom = map.getZoom();
                var mapOffset = wax.util.offset(map.getDiv());
                var get = wax.util.bind(function(mapType) {
                    if (!mapType.interactive) return;
                    for (var key in mapType.cache) {
                        if (key.split('/')[0] != zoom) continue;
                        var tileOffset = wax.util.offset(mapType.cache[key]);
                        this._getTileGrid.push([
                            tileOffset.top - mapOffset.top,
                            tileOffset.left - mapOffset.left,
                            mapType.cache[key]
                        ]);
                    }
                }, this);
                // Iterate over base mapTypes and overlayMapTypes.
                for (var i in map.mapTypes) get(map.mapTypes[i]);
                map.overlayMapTypes.forEach(get);
            }
            return this._getTileGrid;
        },

        clearTileGrid: function(map, e) {
            this._getTileGrid = null;
        },

        getTile: function(evt) {
            var tile;
            var grid = this.getTileGrid();
            for (var i = 0; i < grid.length; i++) {
                if ((grid[i][0] < evt.pixel.y) &&
                    ((grid[i][0] + 256) > evt.pixel.y) &&
                    (grid[i][1] < evt.pixel.x) &&
                    ((grid[i][1] + 256) > evt.pixel.x)) {
                    tile = grid[i][2];
                    break;
                }
            }
            return tile || false;
        },

        onMove: function(evt) {
            if (!this._onMove) this._onMove = wax.util.bind(function(evt) {
                var tile = this.getTile(evt);
                if (tile) {
                    this.waxGM.getGrid(tile.src, wax.util.bind(function(err, g) {
                        if (err || !g) return;
                        var feature = g.tileFeature(
                            evt.pixel.x + wax.util.offset(map.getDiv()).left,
                            evt.pixel.y + wax.util.offset(map.getDiv()).top,
                            tile,
                            { format: 'teaser' }
                        );
                        // Support only a single layer.
                        // Thus a layer index of **0** is given to the tooltip library
                        if (feature && this.feature !== feature) {
                            this.feature = feature;
                            this.callbacks.out(map.getDiv());
                            this.callbacks.over(feature, map.getDiv(), 0, evt);
                        } else if (!feature) {
                            this.feature = null;
                            this.callbacks.out(map.getDiv());
                        }
                    }, this));
                }
            }, this);
            return this._onMove;
        },

        click: function(evt) {
            if (!this._onClick) this._onClick = wax.util.bind(function(evt) {
                var tile = this.getTile(evt);
                if (tile) {
                    this.waxGM.getGrid(tile.src, wax.util.bind(function(err, g) {
                        if (err || !g) return;
                        var feature = g.tileFeature(
                            evt.pixel.x + wax.util.offset(map.getDiv()).left,
                            evt.pixel.y + wax.util.offset(map.getDiv()).top,
                            tile,
                            { format: this.clickAction }
                        );
                        if (feature) {
                            switch (this.clickAction) {
                                case 'full':
                                    this.callbacks.click(feature, map.getDiv(), 0, evt);
                                    break;
                                case 'location':
                                    window.location = feature;
                                    break;
                            }
                        }
                    }, this));
                }
            }, this);
            return this._onClick;
        }
    };

    // Return the interaction control such that the caller may manipulate it
    // e.g. remove it.
    return interaction.add(map);
};

