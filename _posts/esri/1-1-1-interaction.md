---
title: Interaction
tags: esri touch
layout: control
---

<div class='demo-map claro' id='map-div'></div>

Über-fast interactivity for maps made with [TileMill](http://tilemill.com/)
and delivered by [MapBox](http://mapbox.com/), compatible with the
[ESRI ArcGIS API for Javascript 2.8](http://help.arcgis.com/en/webapi/javascript/arcgis/index.html).

ESRI's API is typically included from
a remote server. That looks like:

<pre class='prettyprint'>
&lt;script
  type='text/javascript'
  src='https://serverapi.arcgisonline.com/jsapi/arcgis/?v=2.8'&gt;&lt;/script&gt;
&lt;link
  rel='stylesheet'
  type='text/css'
  href='http://serverapi.arcgisonline.com/jsapi/arcgis/2.8/js/dojo/dijit/themes/claro/claro.css'&gt;
</pre>

You'll also need to add the class `claro` to div your map will live in,
so that the 'claro' stylesheet affects it.

The interaction control lets you do whatever you want with the interactivity
it provides - see [the documentation on tooltips and its API for the full story.](/wax/tooltips.html)

<pre class='prettyprint live'>
var url = 'http://api.tiles.mapbox.com/v3/mapbox.geography-class.jsonp';
wax.tilejson(url, function(tilejson) {
   var map = new esri.Map('map-div', {
     extent: new esri.geometry.Extent(-13686470.64, 5203830.72, -13669270.31, 5215290.28,
     new esri.SpatialReference({
       wkid: 3857
     }))
   });

   map.addLayer(new wax.esri.connector(tilejson));
   wax.esri.attribution(map, tilejson).appendTo(map.root);

   wax.esri.interaction()
       .map(map)
       .tilejson(tilejson)
       .on(wax.tooltip().parent(map.root).events());
});
</pre>
