;wax = wax || {};

// Attribution
// -----------
wax.attribution = function() {
    var container,
        a = {};

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

    function idX(id) {
        return id;
    }

    a.content = function(x) {
        if (typeof x === 'undefined') return container.innerHTML;
        container.innerHTML = html_sanitize(x, urlX, idX);
        return this;
    };

    a.element = function() {
        return container;
    };

    a.init = function() {
        container = document.createElement('div');
        container.className = 'map-attribution';
        return this;
    };

    return a.init();
};
