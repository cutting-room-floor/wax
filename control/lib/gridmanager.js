// GridManager
// -----------
// Generally one GridManager will be used per map.
//
// It takes one options object, which current accepts a single option:
// `resolution` determines the number of pixels per grid element in the grid.
// The default is 4.
wax.gm = function() {

    var resolution = 4,
        grid_tiles = {},
        manager = {},
        tilejson,
        formatter;

    var gridUrl = function(url) {
        if (url) {
            return url.replace(/(\.png|\.jpg|\.jpeg)(\d*)/, '.grid.json');
        }
    };

    function templatedGridUrl(template) {
        if (typeof template === 'string') template = [template];
        return function templatedGridFinder(url) {
            if (!url) return;
            var rx = new RegExp(manager.tileRegexp())
            var xyz = rx.exec(url);
            if (!xyz) return;
            return template[parseInt(xyz[2], 10) % template.length]
                .replace(/\{z\}/g, xyz[1])
                .replace(/\{x\}/g, xyz[2])
                .replace(/\{y\}/g, xyz[3]);
        };
    }

    // return the regexp to catch the tile number given the url
    manager.tileRegexp = function() {
      var tileTemplate = tilejson.tiles[0];
      // remove params
      var p = tileTemplate.indexOf('?');
      if(p !== -1) {
        tileTemplate = tileTemplate.substr(0, p);
      }
      // remove from the url all the special characters
      // replacing them by a dot (dont mind the character)
      tileTemplate = tileTemplate.
                        replace(/[\(\)\?\$\*\+\^]/g,'.')

      // the browser removes the port in the case it matchs with
      // the default port of the protocol
      if(tileTemplate.indexOf('https') === 0) {
        tileTemplate = tileTemplate.replace(':443', '[:0-9]*')
      } else if(tileTemplate.indexOf('http') === 0) {
        tileTemplate = tileTemplate.replace(':80', '[:0-9]*')
      }

      var r = '';
      if(tilejson.tiles.length > 1) {
        var t0 = tilejson.tiles[0];
        var t1 = tilejson.tiles[1];
        //search characters where differs
        for(var i = 0; i < t0.length; ++i) {
          if(t0.charAt(i) != t1.charAt(i)) {
            r += '.';
          } else {
            r += tileTemplate.charAt(i) || '';
          }
        }
      } else {
        r = tileTemplate;
      }

      // replace the first {x}{y}{z} by (\\d+)
      return r
        .replace(/\{x\}/,'(\\d+)')
        .replace(/\{y\}/,'(\\d+)')
        .replace(/\{z\}/,'(\\d+)')
    }

    manager.formatter = function(x) {
        if (!arguments.length) return formatter;
        formatter =  wax.formatter(x);
        return manager;
    };

    manager.template = function(x) {
        if (!arguments.length) return formatter;
        formatter = wax.template(x);
        return manager;
    };

    manager.gridUrl = function(x) {
        // Getter-setter
        if (!arguments.length) return gridUrl;

        // Handle tilesets that don't support grids
        if (!x) {
            gridUrl = function() { return null; };
        } else {
            gridUrl = typeof x === 'function' ?
                x : templatedGridUrl(x);
        }
        return manager;
    };

    manager.getGrid = function(url, callback) {
        var gurl = gridUrl(url);
        if (!formatter || !gurl) return callback(null, null);

        wax.request.get(gurl, function(err, t) {
            if (err) return callback(err, null);
            callback(null, wax.gi(t, {
                formatter: formatter,
                resolution: resolution
            }));
        });
        return manager;
    };

    manager.tilejson = function(x) {
        if (!arguments.length) return tilejson;
        // prefer templates over formatters
        if (x.template) {
            manager.template(x.template);
        } else if (x.formatter) {
            manager.formatter(x.formatter);
        } else {
            // In this case, we cannot support grids
            formatter = undefined;
        }
        manager.gridUrl(x.grids);
        if (x.resolution) resolution = x.resolution;
        tilejson = x;
        return manager;
    };

    return manager;
};
