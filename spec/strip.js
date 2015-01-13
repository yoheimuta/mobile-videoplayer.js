describe("strip", function() {

    beforeEach(function() {
        jasmine.getFixtures().fixturesPath = 'spec/fixtures';
        loadFixtures('strip.html');
    });

    it("constructor", function (){
        var width   = 100;
        var height  = 200;
        var element = document.getElementsByClassName("strip")[0];

        var strip   = new MVPlayer.Strip(width, height, element);
        expect(strip.width).toEqual(width);
        expect(strip.height).toEqual(height);
        expect(strip.image_url).toEqual("strip.jpg");
        expect(strip.frame_count).toEqual(54);
        expect(strip.element).toEqual(element);
        expect(strip.frame_index).toEqual(0);
        expect(strip.frames.length).toEqual(54);
        expect(strip.imageElement.style.width).toEqual(width + "px");
        expect(strip.imageElement.style.height).toEqual((height * 54) + "px");
    });
});

