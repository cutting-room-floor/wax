wax = wax || {};
wax.leaf = wax.leaf || {};

wax.leaf.connector = L.TileLayer.extend({
    initialize: function(options) {
        options = options || {};
        if (options.bounds) {
          options.bounds = [
            [options.bounds[1], options.bounds[0]],
            [options.bounds[3], options.bounds[2]]
          ]
        }
        options.minZoom = options.minzoom || 0;
        options.maxZoom = options.maxzoom || 22;
        L.TileLayer.prototype.initialize.call(this, options.tiles[0], options);
    }
});
