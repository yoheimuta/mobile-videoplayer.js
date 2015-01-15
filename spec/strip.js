describe("strip", function() {

    var width   = 320;
    var height  = 180;
    var element;

    beforeEach(function() {
        jasmine.getFixtures().fixturesPath = 'spec/fixtures';
        loadFixtures('strip.html');

        element = document.getElementsByClassName("strip")[0];
    });

    it("constructor", function (){
        var strip = createStrip();
        expect(strip.width).toEqual(width);
        expect(strip.height).toEqual(height);
        expect(strip.image_url).toEqual("spec/fixtures/asset.jpg");
        expect(strip.element).toEqual(element);
        expect(strip.element.style.position).toEqual("absolute");
        expect(strip.image_element.style.width).toEqual(width + "px");
    });

    it("load", function (done){
        var strip = createStrip();
        strip.load(function() {
            expect(strip.image_element.style.height).toEqual("9720px");
            expect(strip.frame_count).toEqual(54);
            expect(strip.frames.length).toEqual(54);
            expect(strip.frame_index).toEqual(0);
            done();
        });
    });

    function createStrip() {
        return new MVPlayer.Strip(width, height, element);
    }
});

