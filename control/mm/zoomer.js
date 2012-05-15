/*jslint browser: true, vars: true, forin: true, white: true, nomen: true, plusplus: true, maxerr: 50, indent: 4 */
/*global wax: true, bean: false, toString: false */
wax = wax || {};
wax.mm = wax.mm || {};

// Zoomer
// ------
// Add zoom links, which can be styled as buttons, to a `modestmaps.Map`
// control. This function can be used chaining-style with other
// chaining-style controls.
wax.mm.zoomer = function (map, has_scale) {
    'use strict';

    // Zoom level scale control.
    var scale = {
        el: document.createElement('div'),     // Container element.
        slider: null,                          // Slider element.
        levels: [],                            // Notch object element holder.
        notch_points: [],                      // Points (pixels from top) that represent each notch.
        min: null,                             // Min zoom level.
        max: null,                             // Max zoom level.
        height: null,                          // Container height.

        /**
         * Setup container and append to parent.
         */
        init: function (parent) {
            this.el.className = "wax-zoom-scale"; // Set class name.
            wax.u.$(parent).appendChild(this.el); // Append to parent el.
            return this;
        },

        /**
         * This should be called once the map is drawn.
         * Append elements in the slider container. Basically the notches 
         * and the slider.
         */
        draw: function (map, min_zoom, max_zoom) {
            // If the min/max zoom is different than it was previously,
            // or just being set for the first time, make the scale.
            // This also allows for the scale up update itself if the
            // min and max zoom are changed. Usually this only happens
            // once though.
            if (this.min !== min_zoom || this.max !== max_zoom) {
                this.min = min_zoom;
                this.max = max_zoom;
                this._clear_scale();  // Clear the scale.

                this.el.style.position = "absolute"; // Make absolute.

                // Set a default height/width if none is defined in css.
                this.height = this.el.offsetHeight || 200;
                this.width = this.el.offsetWidth || 20;

                // Set css for container.
                this.el.style.width = this.width + 'px';
                this.el.style.height = this.height + 'px';
                this.el.style.zIndex = "100";
                this.el.style.cursor = "pointer";

                // Append notches to notch container, starting with the 
                // maximum.
                var _level = this.max;
                while (_level >= this.min) {
                    this.el.appendChild(this._make_notch(_level));
                    _level--; // Decrement till the min is reached.
                }

                // Append the slider element.
                this.el.appendChild(this._make_slider());
            }

            // Update the scale.
            this.update(map.coordinate.zoom);

            return this;
        },

        /**
         * Called when the map is zoomed so the scale updates itself.
         */
        update: function (level) {
            // Move the slider to its appropriate position on the scale if
            // the user is not moving it manually.
            if (!this.slider_pressed) {
                this.slider.style.top = this._slider_pos_from_level(level) + 'px';
            }
            return this;
        },

        /**
         * Create notch dom el and add to notch obj.
         */
        _make_notch: function (level) {
            var notch = document.createElement('div'),
                fixed_padding = this.height / (this.max - this.min),
                spacing = this.notch_points.length * fixed_padding;

            // Apply css to notch.
            notch.className = "wax-notch level_" + level;
            notch.style.zIndex = "0";
            notch.style.position = "absolute";
            notch.style.top = spacing+'px';
            this.levels.unshift(level);
            this.notch_points.unshift(spacing);
            return notch;
        },

        /**
         * Create slider element.
         */
        _make_slider: function () {
            this.slider = document.createElement('div');
            this.slider.className = "wax-slider";
            this.slider.style.position = "absolute";
            this.slider.style.zIndex = "5";
            this.slider.style.cursor = "pointer";

            // Get self instance.
            var that = this;
            
            // Get container's position on the page.
            var slider_offset = wax.mm.zoomer.offset(this.el).top;

            // Set to true when the user clicks the slider.
            this.slider_pressed = false;
            
            // Handles the slider being manually dragged.
            var sliding = function (evt) {
                if (that.slider_pressed) {
                    var offset = evt.clientY - slider_offset, level;
                    evt.stop();
                    if (offset >= 0 && offset <= that.height) {
                        that.slider.style.top = offset + 'px';
                        level = that._level_from_slider_pos(
                            wax.mm.zoomer.closest_in_arr(that.notch_points, offset)
                        );
                        map.setZoom(level);
                    }
                }
            };

            // Add event listeners for it.
            bean.add(this.slider, 'mousedown', function(evt) {
                evt.stop();
                that.slider_pressed = true;
            });
            bean.add(this.el, 'mousedown', function(evt) {
                evt.stop();
                that.slider_pressed = true;
                sliding(evt);
            });
            bean.add(document, 'mouseup mouseleave click', function() {
                that.slider_pressed = false;
            });
            bean.add(document, 'mousemove', sliding);
            return this.slider;
        },
        
        /**
         * Remove everything from the scale and start fresh.
         */
        _clear_scale: function () {
            this.el.innerHTML = '';
            this.levels = [];
            this.notch_points = [];
            bean.remove(this.el);     // For memory leaks.
            bean.remove(this.slider); // For memory leaks.
            bean.remove(document);    // For memory leaks.
            return this;
        },

        /**
         * Returns the position (in pixels) based on a map zoom level.
         */
        _slider_pos_from_level: function (level) {
            var i, len = this.levels.length, pos;
            for (i = 0; len > i; i++) {
                if (level === this.levels[i]) {
                    pos = this.notch_points[i];
                    break;
                }
            }
            return pos;
        },


        /**
         * Return the map level for a given slider position. Based on
         * the positions in the notch_points array.
         */
        _level_from_slider_pos: function (pos) {
            var i, len = this.levels.length, pos_index;
            for (i = 0; len > i; i++) {
                if (pos === this.notch_points[i]) {
                    pos_index = i;
                    break;
                }
            }
            return this.levels[pos_index];
        }
    };


    // Create container for zoomer.
    var zoomer_container = document.createElement('div');
    zoomer_container.className = 'wax-zoomer';

    // Create zoom in dom el.
    var zoomin = document.createElement('a');
    zoomin.innerHTML = '+';
    zoomin.href = '#';
    zoomin.className = 'zoomer zoomin';
    bean.add(zoomin, 'mousedown dblclick', function(e) {
        e.stop();
    });
    bean.add(zoomin, 'click', function(e) {
        e.stop();
        map.zoomIn();
    }, false);

    // Create zoom out dom el.
    var zoomout = document.createElement('a');
    zoomout.innerHTML = '-';
    zoomout.href = '#';
    zoomout.className = 'zoomer zoomout';
    bean.add(zoomout, 'mousedown dblclick', function(e) {
        e.stop();
    });
    bean.add(zoomout, 'click', function(e) {
        e.stop();
        map.zoomOut();
    });


    var zoomer = {
        add: function (map) {
            map.addCallback('drawn', function (map) {
                if (has_scale) {
                    scale.draw(map, map.coordLimits[0].zoom, map.coordLimits[1].zoom)
                        .update(map.coordinate.zoom); 
                }

                // Set zoom in/out class.
                if (map.coordinate.zoom === map.coordLimits[0].zoom) {
                    zoomout.className = 'zoomer zoomout zoomdisabled';
                } else if (map.coordinate.zoom === map.coordLimits[1].zoom) {
                    zoomin.className = 'zoomer zoomin zoomdisabled';
                } else {
                    zoomin.className = 'zoomer zoomin';
                    zoomout.className = 'zoomer zoomout';
                }
            });

            return this;
        },
        appendTo: function(elem) {
            zoomer_container.appendChild(zoomin);
            zoomer_container.appendChild(zoomout);
            if (has_scale) {
                scale.init(zoomer_container);
            }
            wax.u.$(elem).appendChild(zoomer_container);
            return this;
        }
    };
    return zoomer.add(map);
};

/**
 * Returns the closest value in an array to a given int.
 * Used for determining which position the slider is closest
 * to.
 */
wax.mm.zoomer.closest_in_arr = function (arr, x) {
    'use strict';
    var result, a = wax.mm.zoomer.copy(arr), len = a.length, i, nx;
    a.sort(function (a, b) {
         return a - b;
    });
    for (i=0; len > i; i++) {
        if (x >= a[len-1]) {
           result = a[len-1];
           break;
         } else if (a[i] >= x) {
            nx = a[i-1];
            if (Math.abs(x - a[i]) < Math.abs(x - nx)) {
                result = a[i];
                break;
            } else if (Math.abs(x - nx) < Math.abs(x - a[i])) {
                result = nx;
                break;
            }            
        }                
    }
    return result;
};

/**
 * Utility method for cloning an array or object.
 */
wax.mm.zoomer.copy = function (obj) {
    'use strict';
    var i, copy, len;
    if (Object.prototype.toString.call(obj) === "[object Array]") {
        copy = [];
        for (i = 0, len = obj.length; i < len; ++i) {
            copy[i] = wax.mm.zoomer.copy(obj[i]);
        }
    } else if (Object.prototype.toString.call(obj) === "[object Object]") {
        copy = {};
        for (i in obj) {
            if (obj.hasOwnProperty(i)) {
                copy[i] = wax.mm.zoomer.copy(obj[i]);
            }
        }
    } else {
        copy = obj;
    }
    return copy;
};

/**
 * Utility method for obtaining an elements position on a page.
 * Equivalent to jQuery's offset().
 */
wax.mm.zoomer.offset = function (element) {
    'use strict';
    var coords = { left: 0, top: 0};
    while (element) {
        coords.left += element.offsetLeft;
        coords.top += element.offsetTop;
        element = element.offsetParent;
    }
    return coords;
};
