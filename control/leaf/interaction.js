//   If not given, the `wax.tooltip` library will be expected.
// * `clickAction` (optional): **full** or **location**: default is
//   **full**.
wax.leaf.interaction = function(map, tilejson, options) {
    tilejson = tilejson || {};
    options = options || {};
	
	var waxGM = wax.GridManager(tilejson),
		callbacks = options.callbacks || new wax.tooltip(options),
		clickAction = options.clickAction || ['full', 'location'],
		clickHandler = options.clickHandler || function(url) {
			window.location = url;
		},
		interaction = {},
		_downLock = false,
		_clickTimeout = false,
		touchable = ('ontouchstart' in document.documentElement),
		// Active feature
		_af,
		// Down event
		_d,
		// Touch tolerance
		tol = 4,
		tileGrid;
	
	// Search through `.tiles` and determine the position,
    // from the top-left of the **document**, and cache that data
    // so that `mousemove` events don't always recalculate.
    function getTileGrid() {
        // TODO: don't build for tiles outside of viewport
        // Touch interaction leads to intermediate
        //var zoomLayer = map.createOrGetLayer(Math.round(map.getZoom())); //?what is this doing?
        // Calculate a tile grid and cache it, by using the `.tiles`
        // element on this map.
        return tileGrid || (tileGrid =
            (function(layers) {
				var o = [];
				for (var layerId in layers) {
					// This only supports tiled layers
					if (layers[layerId]._tiles) {
						for (var tile in layers[layerId]._tiles) {
							var offset = wax.util.offset(layers[layerId]._tiles[tile]);
							o.push([offset.top, offset.left, layers[layerId]._tiles[tile]]);
						}
					}
				}
				return o;
			})(map._layers));
    };

	// When the map moves, the tile grid is no longer valid.
    function clearTileGrid(map, e) {
        tileGrid = null;
    }

    function getTile(e) {
        for (var i = 0, grid = getTileGrid(); i < grid.length; i++) {
            if ((grid[i][0] < e.y) &&
               ((grid[i][0] + 256) > e.y) &&
                (grid[i][1] < e.x) &&
               ((grid[i][1] + 256) > e.x)) return grid[i][2];
        }
        return false;
    }

	// Clear the double-click timeout to prevent double-clicks from
    // triggering popups.
    function killTimeout() {
        if (_clickTimeout) {
            window.clearTimeout(_clickTimeout);
            _clickTimeout = null;
            return true;
        } else {
            return false;
        }
    }
	
	function onMove(e) {
        // If the user is actually dragging the map, exit early
        // to avoid performance hits.
        if (_downLock) return;

        var pos = wax.util.eventoffset(e),
            tile = getTile(pos),
            feature;

        if (tile) waxGM.getGrid(tile.src, function(err, g) {
            if (err || !g) return;
            feature = g.tileFeature(pos.x, pos.y, tile, {
                format: 'teaser'
            });
            if (feature) {
                if (feature && _af !== feature) {
                    _af = feature;
                    callbacks.out(map._container);
                    callbacks.over(feature, map._container);
                } else if (!feature) {
                    _af = null;
                    callbacks.out(map._container);
                }
            } else {
                _af = null;
                callbacks.out(map._container);
            }
        });
    }
	
	// A handler for 'down' events - which means `mousedown` and `touchstart`
    function onDown(e) {
        // Ignore double-clicks by ignoring clicks within 300ms of
        // each other.
        if (killTimeout()) { return; }

        // Prevent interaction offset calculations happening while
        // the user is dragging the map.
        //
        // Store this event so that we can compare it to the
        // up event
        _downLock = true;
        _d = wax.util.eventoffset(e);
        if (e.type === 'mousedown') {
			L.DomEvent.addListener(map._container, 'mouseup', onUp, this);

        // Only track single-touches. Double-touches will not affect this
        // control
        } else if (e.type === 'touchstart' && e.touches.length === 1) {

            // turn this into touch-mode. Fallback to teaser and full.
            clickAction = ['full', 'teaser'];

            // Don't make the user click close if they hit another tooltip
            if (callbacks._currentTooltip) {
                callbacks.hideTooltip(callbacks._currentTooltip);
            }

            // Touch moves invalidate touches
			
            L.DomEvent.addListener(map._container, 'touchend', onUp, this);
            L.DomEvent.addListener(map._container, 'touchmove', touchCancel, this);
        }
    }
	
	function touchCancel() {
		L.DomEvent.removeListener(map._container, 'touchend', onUp);
        L.DomEvent.removeListener(map._container, 'touchmove', onUp);
        _downLock = false;
    }
	
	function onUp(e) {
        var pos = wax.util.eventoffset(e);
        _downLock = false;

        L.DomEvent.removeListener(map._container, 'mouseup', onUp);

        if (map._container.ontouchend) {
            L.DomEvent.removeListener(map._container, 'touchend', onUp);
            L.DomEvent.removeListener(map._container, 'touchmove', _touchCancel);
        }

        if (e.type === 'touchend') {
            // If this was a touch and it survived, there's no need to avoid a double-tap
            click(e, _d);
        } else if (Math.round(pos.y / tol) === Math.round(_d.y / tol) &&
            Math.round(pos.x / tol) === Math.round(_d.x / tol)) {
            // Contain the event data in a closure.
            _clickTimeout = window.setTimeout(
                function() {
                    _clickTimeout = null;
                    click(e, pos);
                }, 300);
        }
        return onUp;
    }
	
	// Handle a click event. Takes a second
    function click(e, pos) {
        var tile = getTile(pos),
            feature;

        if (tile) waxGM.getGrid(tile.src, function(err, g) {
            for (var i = 0; g && i < clickAction.length; i++) {
                feature = g.tileFeature(pos.x, pos.y, tile, {
                    format: clickAction[i]
                });
                if (feature) {
                    switch (clickAction[i]) {
                        case 'full':
                        // clickAction can be teaser in touch interaction
                        case 'teaser':
                            return callbacks.click(feature, map._container, 0, e);
                        case 'location':
                            return clickHandler(feature);
                    }
                }
            }
        });
    }
	
	// Attach listeners to the map
    interaction.add = function() {
        var l = ['moveend', 'layerswitched'];
        for (var i = 0; i < l.length; i++) {
            map.on(l[i], clearTileGrid);
        }
        L.DomEvent.addListener(map._container, 'mousemove', onMove);
        L.DomEvent.addListener(map._container, 'mousedown', onDown);
        if (touchable) {
            L.DomEvent.addListener(map._container, 'touchstart', onDown);
        }
        return this;
    };

    // Remove this control from the map.
    interaction.remove = function() {
        var l = ['moveend', 'layerswitched'];
        for (var i = 0; i < l.length; i++) {
            map.off(l[i], clearTileGrid);
        }
        L.DomEvent.removeListener(map._container, 'mousemove', onMove);
        L.DomEvent.removeListener(map._container, 'mousedown', onDown);
        if (touchable) {
            L.DomEvent.removeListener(map._container, 'touchstart', onDown);
        }
        if (callbacks._currentTooltip) {
            callbacks.hideTooltip(callbacks._currentTooltip);
        }
        return this;
    };

    // Ensure chainability
    return interaction.add(map);
};