---
title: Connector
tags: Google
layout: control
---

The code in `wax.g.connector` helps you use Google Maps with tiles you generate with
[TileMill](http://tilemill.com) and serve with
[TileStream](http://mapbox.com/tilestream). It translates from [TileJSON](https://github.com/mapbox/tilejson)
specification into the options you need to set up a layer for Google.

- Include the Google Maps API V3 according to the [API documentation](http://code.google.com/apis/maps/documentation/javascript/tutorial.html#Loading_the_Maps_API).
- `wax/dist/wax.g.js` contains the Wax controls and integration code for
  Google Maps.
- `wax/theme/controls.css` contains default styles for controls. You can always
  swap in your own later on.

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
</pre>

Wax has a custom Google map type that can display tilesets described by
the TileJSON format at `wax.g.connector`.

<div id='map-div' class='demo-map'></div>

<pre class='prettyprint live'>
wax.tilejson('http://api.tiles.mapbox.com/v3/mapbox.geography-class.jsonp',
  function(tilejson) {
  var m = new google.maps.Map(
    document.getElementById('map-div'), {
      center: new google.maps.LatLng(0, 0),
      disableDefaultUI: true,
      zoom: 1,
      mapTypeId: google.maps.MapTypeId.ROADMAP });

  // Use this code to set a new layer as a baselayer -
  // which means that it'll be on the bottom of any other
  // layers and you won't see Google tiles
  m.mapTypes.set('mb', new wax.g.connector(tilejson));
  m.setMapTypeId('mb');

  // Or use this code to add it as an overlay
  // m.overlayMapTypes.insertAt(0, new wax.g.connector(tilejson));
});
</pre>

## API

<dl>
  <dt>{% highlight js %}var layer = wax.g.connector(tilejson){% endhighlight %}</dt>
  <dd>
    Create a new Google Maps layer type from a TileJSON snippet.
  </dd>
</dl>

