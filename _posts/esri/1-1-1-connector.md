---
title: Connector
tags: esri touch
layout: control
---

<div class='demo-map claro' id='map-div'></div>

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

<pre class='prettyprint live'>
var url = 'http://api.tiles.mapbox.com/v3/examples.map-vyofok3q.jsonp';
wax.tilejson(url, function(tilejson) {
   var map = new esri.Map('map-div', {
     extent: new esri.geometry.Extent(-13686470.64, 5203830.72, -13669270.31, 5215290.28,
     new esri.SpatialReference({
       wkid: 3857
     }))
   });

   map.addLayer(new wax.esri.connector(tilejson));
});
</pre>
