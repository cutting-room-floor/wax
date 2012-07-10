describe('fullscreen', function() {
    var map;

    beforeEach(function() {
        callbackResult = null;
        var div = document.createElement('div');
        div.style.width = '400px';
        div.style.height = '400px';

        map = new MM.Map(div, new MM.TemplatedMapProvider(
            'http://{S}tile.openstreetmap.org/{Z}/{X}/{Y}.png', ['a.']));
        map.setCenterZoom(new MM.Location(37.811530, -122.2666097), 10);
        wax.mm.fullscreen(map).appendTo(map.parent);
    });

    it('makes the map fullscreen', function() {
        $('.map-fullscreen', map.parent).click();
        expect($(map.parent).hasClass('map-fullscreen-map')).toEqual(true);
    });

    it('can toggle fullscreen', function() {
        $('.map-fullscreen', map.parent).click();
        expect($(map.parent).hasClass('map-fullscreen-map')).toEqual(true);
        $('.map-fullscreen', map.parent).click();
        expect($(map.parent).hasClass('map-fullscreen-map')).toEqual(false);
    });
});
