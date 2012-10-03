var wax = wax || {};

// Utils are extracted from other libraries or
// written from scratch to plug holes in browser compatibility.
wax.u = {
    // From Bonzo
    offset: function(el) {
        // TODO: window margins
        //
        // Okay, so fall back to styles if offsetWidth and height are botched
        // by Firefox.
        var width = el.offsetWidth || parseInt(el.style.width, 10),
            height = el.offsetHeight || parseInt(el.style.height, 10);

        // from jquery, offset.js
        var docElem, body, win, clientTop, clientLeft, scrollTop, scrollLeft,
            box = { top: 0, left: 0 },
            doc = el && el.ownerDocument;

        if ( !doc ) {
            return;
        }

        body = doc.body;
        docElem = doc.documentElement;

        // If we don't have gBCR, just use 0,0 rather than error
        // BlackBerry 5, iOS 3 (original iPhone)
        if ( typeof el.getBoundingClientRect !== "undefined" ) {
            box = el.getBoundingClientRect();
        }
        win = window;
        clientTop  = docElem.clientTop  || body.clientTop  || 0;
        clientLeft = docElem.clientLeft || body.clientLeft || 0;
        scrollTop  = win.pageYOffset || docElem.scrollTop;
        scrollLeft = win.pageXOffset || docElem.scrollLeft;

        return {
            top: box.top  + scrollTop  - clientTop,
            left: box.left + scrollLeft - clientLeft,
            height: height,
            width: width
        };
    },

    '$': function(x) {
        return (typeof x === 'string') ?
            document.getElementById(x) :
            x;
    },

    // From quirksmode: normalize the offset of an event from the top-left
    // of the page.
    eventoffset: function(e) {
        var posx = 0;
        var posy = 0;
        if (!e) { e = window.event; }
        if (e.pageX || e.pageY) {
            // Good browsers
            return {
                x: e.pageX,
                y: e.pageY
            };
        } else if (e.clientX || e.clientY) {
            // Internet Explorer
            return {
                x: e.clientX,
                y: e.clientY
            };
        } else if (e.touches && e.touches.length === 1) {
            // Touch browsers
            return {
                x: e.touches[0].pageX,
                y: e.touches[0].pageY
            };
        }
    },

    // Ripped from underscore.js
    // Internal function used to implement `_.throttle` and `_.debounce`.
    limit: function(func, wait, debounce) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var throttler = function() {
                timeout = null;
                func.apply(context, args);
            };
            if (debounce) clearTimeout(timeout);
            if (debounce || !timeout) timeout = setTimeout(throttler, wait);
        };
    },

    // Returns a function, that, when invoked, will only be triggered at most once
    // during a given window of time.
    throttle: function(func, wait) {
        return this.limit(func, wait, false);
    },

    sanitize: function(content) {
        if (!content) return '';

        function urlX(url) {
            // Data URIs are subject to a bug in Firefox
            // https://bugzilla.mozilla.org/show_bug.cgi?id=255107
            // which let them be a vector. But WebKit does 'the right thing'
            // or at least 'something' about this situation, so we'll tolerate
            // them.
            if (/^(https?:\/\/|data:image)/.test(url)) {
                return url;
            }
        }

        function idX(id) { return id; }

        return html_sanitize(content, urlX, idX);
    }
};
