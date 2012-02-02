var wax = wax || {};
wax.ol = wax.ol || {};

wax.ol.connector = function(tilejson) {
    for (var i = 0; i < tilejson.tiles.length; i++) {
        tilejson.tiles[i] = tilejson.tiles[i]
            .replace('{z}', '${z}')
            .replace('{x}', '${x}')
            .replace('{y}', '${y}');
    }
    return new OpenLayers.Layer.XYZ(
        tilejson.name,
        tilejson.tiles, {
            sphericalMercator: true,
            zoomOffset: tilejson.minzoom,
            numZoomLevels: tilejson.maxzoom - tilejson.minzoom,
            attribution: tilejson.attribution
        });
};
