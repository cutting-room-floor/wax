var wax = wax || {};

wax.location = function() {

    var t = {};

    function on(o) {
        if ((o.e.type === 'mousemove' || !o.e.type)) {
            return;
        } else {
            var loc = o.formatter({ format: 'location' }, o.data);
            if (loc) {
                window.top.location.href = loc;
            }
        }
    }

    t.events = function() {
        return {
            on: on
        };
    };

    return t;

};
