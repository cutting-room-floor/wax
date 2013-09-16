---
title: Interaction
tags: Google
layout: control
---

You can add über-fast interactivity to maps made with
[TileMill](http://tilemill.com/).

<pre class='prettyprint'>
&lt;html&gt;
&lt;head&gt;
  &lt;script
    src='https://maps.google.com/maps/api/js?sensor=false'
    type='text/javascript'&gt;&lt;/script&gt;
  &lt;script
    src='wax/dist/wax.g.min.js'
    type='text/javascript'&gt;&lt;/script&gt;
  &lt;link
    href='wax/theme/controls.css'
    rel='stylesheet'
    type='text/css' /&gt;
    </head>
</pre>

Wax has a custom Google map type that can display tilesets described by
the TileJSON format at `wax.g.connector`.

<div id='map-div' class='demo-map'></div>

<pre class='prettyprint live'>
var url = 'http://api.tiles.mapbox.com/v3/mapbox.geography-class.jsonp';

wax.tilejson(url, function(tilejson) {
  var m = new google.maps.Map(
    document.getElementById('map-div'), {
      center: new google.maps.LatLng(0, 0),
      disableDefaultUI: true,
      zoom: 1,
      mapTypeId: google.maps.MapTypeId.ROADMAP });
  m.mapTypes.set('mb', new wax.g.connector(tilejson));
  m.setMapTypeId('mb');

  wax.g.interaction()
    .map(m)
    .tilejson(tilejson)
    .on(wax.tooltip().parent(m.getDiv()).events());
});
</pre>
