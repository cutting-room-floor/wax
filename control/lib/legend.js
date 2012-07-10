// Wax Legend
// ----------

// Wax header
var wax = wax || {};

wax.legend = function() {
    var element,
        legend = {},
        container;

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

    legend.element = function() {
        return container;
    };

    legend.content = function(content) {
        if (!arguments.length) return element.innerHTML;
        if (content) {
            element.innerHTML = html_sanitize(content, urlX, idX);
            element.style.display = 'block';
        } else {
            element.innerHTML = '';
            element.style.display = 'none';
        }
        return legend;
    };

    legend.add = function() {
        container = document.createElement('div');
        container.className = 'map-legends';

        element = container.appendChild(document.createElement('div'));
        element.className = 'map-legend';
        element.style.display = 'none';
        return legend;
    };

    return legend.add();
};
