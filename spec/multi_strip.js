describe("multi_strip", function() {

    beforeEach(function() {
        jasmine.getFixtures().fixturesPath = 'spec/fixtures';
        loadFixtures('multi_strip.html');
    });

    it("constructor", function (){
        var movie = createMovie();
        expect(movie.strip_index).toEqual(0);
        expect(movie.strip_loaded_count).toEqual(0);
        expect(movie.strip_already_loading).toEqual(false);
        expect(movie.strips.length).toEqual(3);
        expect(movie.strips[0].frame_index).toEqual(0);
        expect(movie.strips[1].frame_index).toEqual(0);
        expect(movie.strips[2].frame_index).toEqual(0);
    });

    it("getCurrentFrameIndex", function() {
        var movie = createMovie();

        for (var i = 0; i < 54+54+44; i++) {
            expect(movie.getCurrentFrameIndex()).toEqual(i+1);
            movie.move();
        }
        expect(movie.getCurrentFrameIndex()).toEqual(54+54+1);
    });

    it("getTotalFrameCount", function() {
        var movie = createMovie();
        expect(movie.getTotalFrameCount()).toEqual(54+54+44);
    });

    it("isInit", function() {
        var movie = createMovie();
        expect(movie.isInit()).toEqual(true);
    });

    it("isFinished", function() {
        var movie = createMovie();
        for (var i = 0; i < 54+54+44-1; i++) {
            movie.move();
        }
        expect(movie.isFinished()).toEqual(true);
    });

    it("move", function() {
        var movie = createMovie();

        for (var i = 0; i < 54; i++) {
            expect(movie.strip_index).toEqual(0);
            expect(movie.strips[0].frame_index).toEqual(i);
            movie.move();
        }

        for (var i = 0; i < 54; i++) {
            expect(movie.strip_index).toEqual(1);
            expect(movie.strips[1].frame_index).toEqual(i);
            movie.move();
        }

        for (var i = 0; i < 44; i++) {
            expect(movie.strip_index).toEqual(2);
            expect(movie.strips[2].frame_index).toEqual(i);
            movie.move();
        }

        expect(movie.strip_index).toEqual(2);
        expect(movie.strips[2].frame_index).toEqual(0);
    });

    function createMovie() {
        var width    = 100;
        var height   = 200;
        var elements = document.getElementsByClassName("strip");

        return new MVPlayer.MultiStrip(width, height, elements);
    }
});


