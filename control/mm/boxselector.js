wax = wax || {};
wax.mm = wax.mm || {};

wax.mm.boxselector = function() {
    var corner,
        nearCorner,
        boxDiv,
        style,
        borderWidth = 0,
        horizontal = false,  // Whether the resize is horizontal
        vertical = false,
        edge = 5,  // Distance from border sensitive to resizing
        addEvent = MM.addEvent,
        removeEvent = MM.removeEvent,
        box,
        boxselector = {},
        map,
        callbackManager = new MM.CallbackManager(boxselector, ['change']);

    function getMousePoint(e) {
        // start with just the mouse (x, y)
        var point = new MM.Point(e.clientX, e.clientY);
        // correct for scrolled document
        point.x += document.body.scrollLeft +
            document.documentElement.scrollLeft;
        point.y += document.body.scrollTop +
            document.documentElement.scrollTop;

        // correct for nested offsets in DOM
        for (var node = map.parent; node; node = node.offsetParent) {
            point.x -= node.offsetLeft;
            point.y -= node.offsetTop;
        }
        return point;
    }

    function mouseDown(e) {
        if (!e.shiftKey) return;

        corner = nearCorner = getMousePoint(e);
        horizontal = vertical = true;

        style.left = corner.x + 'px';
        style.top = corner.y + 'px';
        style.width = style.height = 0;

        addEvent(document, 'mousemove', mouseMove);
        addEvent(document, 'mouseup', mouseUp);

        map.parent.style.cursor = 'crosshair';
        return MM.cancelEvent(e);
    }

    // Resize existing box
    function mouseDownResize(e) {
        var point = getMousePoint(e),
            TL = {
                x: parseInt(boxDiv.offsetLeft, 10),
                y: parseInt(boxDiv.offsetTop, 10)
            },
            BR = {
                x: TL.x + parseInt(boxDiv.offsetWidth, 10),
                y: TL.y + parseInt(boxDiv.offsetHeight, 10)
            };

        // Determine whether resize is horizontal, vertical or both
        horizontal = point.x - TL.x <= edge || BR.x - point.x <= edge;
        vertical = point.y - TL.y <= edge || BR.y - point.y <= edge;

        if (vertical || horizontal) {
            corner = {
                x: (point.x - TL.x < BR.x - point.x) ? BR.x : TL.x,
                y: (point.y - TL.y < BR.y - point.y) ? BR.y : TL.y
            };
            nearCorner = {
                x: (point.x - TL.x < BR.x - point.x) ? TL.x : BR.x,
                y: (point.y - TL.y < BR.y - point.y) ? TL.y : BR.y
            };
            addEvent(document, 'mousemove', mouseMove);
            addEvent(document, 'mouseup', mouseUp);
            return MM.cancelEvent(e);
        }
    }

    function mouseMove(e) {
        var point = getMousePoint(e);
        style.display = 'block';
        if (horizontal) {
            style.left = (point.x < corner.x ? point.x : corner.x) + 'px';
            style.width = Math.abs(point.x - corner.x) - 2 * borderWidth + 'px';
        }
        if (vertical) {
            style.top = (point.y < corner.y ? point.y : corner.y) + 'px';
            style.height = Math.abs(point.y - corner.y) - 2 * borderWidth + 'px';
        }
        changeCursor(point, map.parent);
        return MM.cancelEvent(e);
    }

    function mouseUp(e) {
        var point = getMousePoint(e),
            l1 = map.pointLocation( new MM.Point(
                horizontal ? point.x : nearCorner.x,
                vertical? point.y : nearCorner.y
            ));
            l2 = map.pointLocation(corner);

        // Format coordinates like mm.map.getExtent().
        boxselector.extent([
            new MM.Location(
                Math.max(l1.lat, l2.lat),
                Math.min(l1.lon, l2.lon)),
            new MM.Location(
                Math.min(l1.lat, l2.lat),
                Math.max(l1.lon, l2.lon))
        ]);

        removeEvent(document, 'mousemove', mouseMove);
        removeEvent(document, 'mouseup', mouseUp);

        map.parent.style.cursor = 'auto';
    }

    function mouseMoveCursor(e) {
        changeCursor(getMousePoint(e), boxDiv);
    }

    // Set resize cursor if mouse is on edge
    function changeCursor(point, elem) {
        var TL = {
                x: parseInt(boxDiv.offsetLeft, 10),
                y: parseInt(boxDiv.offsetTop, 10)
            },
            BR = {
                x: TL.x + parseInt(boxDiv.offsetWidth, 10),
                y: TL.y + parseInt(boxDiv.offsetHeight, 10)
            };
        // Build cursor style string
        var prefix = '';
        if (point.y - TL.y <= edge) prefix = 'n';
        else if (BR.y - point.y <= edge) prefix = 's';
        if (point.x - TL.x <= edge) prefix += 'w';
        else if (BR.x - point.x <= edge) prefix += 'e';
        if (prefix !== '') prefix += '-resize';
        elem.style.cursor = prefix;
    }

    function drawbox(map, e) {
        if (!boxDiv || !box) return;
        var br = map.locationPoint(box[1]),
            tl = map.locationPoint(box[0]),
            style = boxDiv.style;

        style.display = 'block';
        style.height = 'auto';
        style.width = 'auto';
        style.left = Math.max(0, tl.x) + 'px';
        style.top = Math.max(0, tl.y) + 'px';
        style.right = Math.max(0, map.dimensions.x - br.x) + 'px';
        style.bottom = Math.max(0, map.dimensions.y - br.y) + 'px';
    }

    boxselector.addCallback = function(event, callback) {
        callbackManager.addCallback(event, callback);
        return boxselector;
    };

    boxselector.removeCallback = function(event, callback) {
        callbackManager.removeCallback(event, callback);
        return boxselector;
    };

    boxselector.extent = function(x, silent) {
        if (!x) return box;

        box = [
            new MM.Location(
                Math.max(x[0].lat, x[1].lat),
                Math.min(x[0].lon, x[1].lon)),
            new MM.Location(
                Math.min(x[0].lat, x[1].lat),
                Math.max(x[0].lon, x[1].lon))
        ];

        drawbox(map);

        if (!silent) callbackManager.dispatchCallback('change', box);
    };
    boxDiv = document.createElement('div');
    boxDiv.className = 'boxselector-box';
    style = boxDiv.style;

    boxselector.add = function() {
        boxDiv.id = map.parent.id + '-boxselector-box';
        map.parent.appendChild(boxDiv);
        borderWidth = parseInt(window.getComputedStyle(boxDiv).borderWidth, 10);

        addEvent(map.parent, 'mousedown', mouseDown);
        addEvent(boxDiv, 'mousedown', mouseDownResize);
        addEvent(map.parent, 'mousemove', mouseMoveCursor);
        map.addCallback('drawn', drawbox);
        return boxselector;
    };

    boxselector.map = function(x) {
        if (!arguments.length) return map;
        map = x;
        return boxselector;
    };

    boxselector.remove = function() {
        map.parent.removeChild(boxDiv);

        removeEvent(map.parent, 'mousedown', mouseDown);
        removeEvent(boxDiv, 'mousedown', mouseDownResize);
        removeEvent(map.parent, 'mousemove', mouseMoveCursor);

        map.removeCallback('drawn', drawbox);
        return boxselector;
    };

    return boxselector;
};
