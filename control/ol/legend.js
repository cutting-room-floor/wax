// Wax: Legend Control
// -------------------

;var wax = wax || {};
wax.ol = wax.ol || {};

wax.ol.Legend = OpenLayers.Class(OpenLayers.Control, {
    CLASS_NAME: 'map.ol.Legend',
    legend: null,
    options: null,

    initialize: function(options) {
        this.options = options || {};
        OpenLayers.Control.prototype.initialize.apply(this, [options || {}]);
    },

    activate: function() {
        this.legend = new wax.legend(this.map.viewPortDiv, this.options.container);
        return OpenLayers.Control.prototype.activate.apply(this, arguments);
    },

    setMap: function(map) {
        OpenLayers.Control.prototype.setMap.apply(this, arguments);
        this.activate();
        this.map.events.on({
            'addlayer': this.setLegend,
            'changelayer': this.setLegend,
            'removelayer': this.setLegend,
            'changebaselayer': this.setLegend,
            scope: this
        });
    },

    setLegend: function() {
        var urls = [];
        for (var i = 0; i < this.map.layers.length; i++) {
            var layer = this.map.layers[i];
            if (layer && layer.getURL && layer.visibility) {
                urls.push(layer.getURL(new OpenLayers.Bounds()));
            }
        }
        this.legend.render(urls);
    }
});
