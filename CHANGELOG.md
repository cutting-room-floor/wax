## Changelog

## 6.0.4

* Use `.content()` instead of `.set()` for wax.g.attribution control

## 6.0.3

* The template HTML sanitizer now permits the use of
  `_target` in link elements
* Fix for tooltips updating on hover

## 6.0.2

* Fixes off-by-one error that limited OpenLayers
  users to one less zoom level.

## 6.0.1

* Fixes `.remove()` in interaction controls
* Resizable boxselector
* Improved tests

## 6.0.0-beta6

* Re-adds wax.mm.hash. MM.Hash is worse

## 6.0.0-beta5

* Re-adds fallback to teaser in touch code

## 6.0.0-beta4

* Add ESRI connector & interaction controls
* Add beta Bing connector

## 6.0.0-beta2

* Finished movetip.js
* Pushed to npm

## 6.0.0

* Event dispatcher for tooltips and other functionality
* Rewritten tooltip functionality
* Space optimizations to reduce overall size of library
* Mature implementation of movetip.js
* Now includes bean for events
* Moved all external deps to lib/*

## 5.0.0-alpha*

* Initial support for Modest Maps 1.0.0-alpha

## 4.1.5

* Fixes a bug in touch interaction controls discovered and fixed by @lxbarth

## 4.1.4

* Calls callbacks with `evt` argument from `wax.ol.interaction`
* Strict interaction: doesn't tolerate actions that are on
  elements that are not actually map tiles. This changes behavior
  significantly
* Adds latlngtooltip - a hover-based tooltip.
* Adds a Polymaps connector to the build.

## 4.1.3

* Adds a class, `wax-fullscreen-view`, when the fullscreen control
  is toggled.

## 4.1.2

* Sanitize legend, attribution output.
* Fix bug where template would return multiple formats.

## 4.1.1

* Fix for URL regex in HTML sanitizer integration.

## 4.1.0

* Adds `wax.ol.connector`, an OpenLayers connector

## 4.0.0

* Removes `wax.Record`, which has been deprecated in favor of templating,
  TileJSON, and possibly albums
* Removes interaction autoconfiguration - you should use the
  `wax.tilejson()` instead to provide these details up-front.
* Removes OpenLayers embedder and switcher controls. Embedder was deprecated
  by changes in embedding strategy and map-exchanging should be used
  instead of layer switching.

## 3.1.0

* Adds new formatter api: TileJSON with a `version=1.2` key and `template`
  data will now be templated with Mustache and sent through `html-sanitizer`

### 3.0.9

* Simplified hash control - `hashchange` and `pushState` APIs discontinued
* Added `wax.g.hash()` control
* Moved hash fundamentals to `control/lib/hash.js` and utilities to `utils.js`
* Simplified URL construction
* Added micro-optimizations to reduce code size
* Removed `wax.Record`
* Fixes interaction control in Leaflet

### 3.0.8

* Fixed `wax.mm.interaction()` click callback

### 3.0.7

* Fixes `pointselector.remove()`
* Adds `pointselector.locations()`
* Fixes Google Maps connector - thanks @tokumine
* Fixes and adds silent option to `boxselector.extent()`
* Fixes `wax.tooltip` var error in IE8

### 3.0.6

* Update [reqwest](https://github.com/ded/reqwest) to 0.2.7 for IE9 compatibility.
* Parse `matrix()` CSS transforms for IE9 compatibility.
* Fix to `wax.mm.interaction()` on dragging outside of the map.

### 3.0.5

* `bwdetect` refactored to be compatible with Google Maps.
* Tests for `bwdetect`, `gridFeature`.

### 3.0.4

* Added `bwdetect` control for Modest Maps.
* Add tests using `jasmine` library.
* Bugfixes.

### 3.0.3

* Add support for bleeding-edge MM.
* Bugfixes.

### 3.0.2

* Fixes `xyzFinder` in `wax.GridManager` to handle URLs with query strings.

### 3.0.1

* Expose `#full` and `#original` methods on `wax.mm.fullscreen` allowing API
  access to fullscreen toggling actions.
* Fixes to boxselector and zoombox controls.

### 3.0.0

* TileJSON support in new map connectors: `wax.mm.connector`,
  `wax.leaf.connector` and `wax.g.connector`. The old `wax.g.maptype` and
  `wax.mm.provider` have been removed.
* All `g`, `leaf` and `mm` controls now use the signature
  `function (map, tilejson, options) {}` where relevant TileJSON keys in
  `tilejson` are used if present and `options` contains settings specific to
  the control.
* Fullscreen, zoomer, attribution and legend controls no longer automatically
  append themselves to the map div. Use the `.appendTo` method to add the DOM
  element to the map or to another element on the page.
* `w.melt(func)` now has the same return value as `func`.

_2.x.x_

```javascript
var provider = new wax.mm.provider({
    baseUrl: 'http://a.tiles.mapbox.com/mapbox/',
    layerName: 'natural-earth-2'});
var map = ...;
wax.mm.legend(map);
```

_3.x.x_

```javascript
var connector = new wax.mm.connector({
    tiles: 'http://a.tiles.mapbox.com/mapbox/1.0.0/natural-earth-2/{z}/{x}/{y}.png',
    scheme: 'tms'
    });
var map = ...;
wax.mm.legend(map, { legend: 'Content' }).appendTo(map.parent);
```

### 2.1.6

* Fix for window margin offset calculation.
* Fix zoombox control in IE.

### 2.1.5

* Fixed Hash in FF 4.x

### 2.1.4

* Fixed Interaction in FF 3.6.x
* Optimized Modest Maps scrolling behavior on interactive maps
* Fixed OpenLayers compatibility bug between 2.9 and 2.10

### 2.1.3

* Fixing a touch javascript error.

### 2.1.1

* Overeager touch-events handling fixed.

### 2.1.0

* Leaflet compatibility - interaction control and documentation.
* New pushState-based hash manager, used by default.
* Interaction support on mobile devices, with fallback to
  teaser if full formatter isnt available.

### 2.0.0

* Stripped down the README, now references the manual.
* Renamed `build` to `dist` to avoid `npm` cleanup problems.
* Fix for interaction in Firefox with body margins.
* Added OpenLayers and Google to manual.
* Removed Google and Modest Maps embedder controls. Will return some day...
* All Modest Maps controls are flipped - instead of being extensions of the
  `com.modestmaps.Map` object, they are off of the `wax` object and are
  called with the map as the first argument and an options object as the second
* Modest Maps controls and provider moved from `wax.*` to `wax.mm.*`.
* Google control API changed from `wax.g.Controls` object to `wax.g.*`
  mirroring Modest Maps controls API.
* jQuery, jQuery-jsonp, and Underscore dependency removed
* `gridutil` now uses [reqwest](https://github.com/ded/reqwest) as its
  XMLHTTPRequest library.

#### 1.4.2

* Beta pointselector control.
* Make zoombox removable.

#### 1.4.1

* Tweaks to `boxselect` including removability.

#### 1.4.0

* Added `.boxselect(function())`

#### 1.3.0

* Added `.zoombox()` and `hash()` controls for Modest Maps.

#### 1.2.1

* Bug fixes for OpenLayers

#### 1.2.0

* Functions on the Google Maps `Controls` object are now lowercase.
* Changed `WaxProvider`'s signature: now takes an object of settings and supports multiple domains, filetypes and zoom restrictions.
* Changed `wax.g.MapType`'s signature: now accepts an object of settings in the same form as `WaxProvider`
* Modest Maps `.interaction()` now supports clicks, with the same `clickAction` setting as the OpenLayers version.
* Added large manual for usage.
* Fixed Modest Maps `.fullscreen()` sizing.
* Removed `/examples` directory: examples will be in manuals.
* Performance optimization of interaction code: no calculations are performed during drag events.

#### 1.1.0

* connector/mm: Added [Modest Maps](https://github.com/stamen/modestmaps-js) connector.
* control/mm: Added `.legend()`, `.interaction()`, `.fullscreen()`, and `.zoomer()` controls for Modest Maps.
* control/lib: Added `addedTooltip` event to `tooltip.js` to allow for external styling code.

#### 1.0.4

* connector/g: Hide error tiles and wrap on dateline.
* connector/g: Performance improvements.
* control/legend: Fix rerender bug.
* control/tooltip: `addedtooltip` event for binding/extending tooltip behavior. Subject to change.

#### 1.0.3

* Embedder functionality for Google Maps and OpenLayers.

#### 1.0.2

* Bug fixes for Firefox 3.

#### 1.0.1

* `make ext` added for downloading and installing external libraries needed to use examples.
* Bug fixes for legend, IE compatibility.

#### 1.0.0

* Initial release.
