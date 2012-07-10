wax = wax || {};
wax.esri = wax.esri || {};

// Attribution
// -----------
// Attribution wrapper for Modest Maps.
wax.esri.attribution = function(map, tilejson) {
    tilejson = tilejson || {};
    var a, // internal attribution control
        attribution = {};

    attribution.element = function() {
        return a.element();
    };

    attribution.appendTo = function(elem) {
        wax.u.$(elem).appendChild(a.element());
        return this;
    };

    attribution.init = function() {
        a = wax.attribution();
        a.content(tilejson.attribution);
        a.element().className = 'map-attribution map-mm';
        return this;
    };

    return attribution.init();
};
