describe('attribution', function() {
    var map, attribution;

    beforeEach(function() {
        callbackResult = null;
        var div = document.createElement('div');

        map = new MM.Map(div, new MM.TemplatedMapProvider(
            'http://{S}tile.openstreetmap.org/{Z}/{X}/{Y}.png', ['a.']), new MM.Point(600, 600));
        map.setCenterZoom(new MM.Location(37.811530, -122.2666097), 10);
        attribution = wax.mm.attribution(map, {
            attribution: '42'
        }).appendTo(map.parent);
    });

    afterEach(function() {
        div = null;
        map.destroy();
    });

    it('can have its content set', function() {
        expect($('.map-attribution', map.parent).text()).toEqual('42');
    });

    it('returns its element', function() {
        expect(attribution.element()).toEqual($('.map-attribution', map.parent)[0]);
    });

    it('can be appended to an element', function() {
        var newElem = document.createElement('div');
        attribution.appendTo(newElem);
        expect(attribution.element().parentNode).toEqual(newElem);
    });
});
