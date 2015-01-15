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
    });

    it("load", function(done) {
        var movie = createMovie();
        movie.load(function(err) {
            expect(err).toBeNull();
            expect(movie.strips[0].frame_count).toEqual(54);
            expect(movie.strips[1].frame_count).toEqual(54);
            expect(movie.strips[2].frame_count).toEqual(54);

            // valid dup call
            movie.load(function(err) {
                expect(err).toBeNull();
                done();
            });
        });

        expect(movie.strip_already_loading).toEqual(true);

        // invalid dup call
        movie.load(function(err) {
            expect(err).not.toBeNull();
        });
    });

    it("getCurrentFrameIndex", function(done) {
        var movie = createMovie();
        movie.load(function(err) {
            for (var i = 0; i < 54+54+54; i++) {
                expect(movie.getCurrentFrameIndex()).toEqual(i+1);
                movie.move();
            }
            expect(movie.getCurrentFrameIndex()).toEqual(54+54+1);
            done();
        });
    });

    it("getTotalFrameCount", function(done) {
        var movie = createMovie();
        movie.load(function() {
            expect(movie.getTotalFrameCount()).toEqual(54+54+54);
            done();
        });
    });

    it("isInit", function(done) {
        var movie = createMovie();
        movie.load(function() {
            expect(movie.isInit()).toEqual(true);
            done();
        });
    });

    it("isFinished", function(done) {
        var movie = createMovie();
        movie.load(function() {
            for (var i = 0; i < 54+54+54-1; i++) {
                movie.move();
            }
            expect(movie.isFinished()).toEqual(true);
            done();
        });
    });

    it("move", function(done) {
        var movie = createMovie();
        movie.load(function() {
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

            for (var i = 0; i < 54; i++) {
                expect(movie.strip_index).toEqual(2);
                expect(movie.strips[2].frame_index).toEqual(i);
                movie.move();
            }

            expect(movie.strip_index).toEqual(2);
            expect(movie.strips[2].frame_index).toEqual(0);
            done();
        });
    });

    function createMovie() {
        var width    = 320;
        var height   = 180;
        var elements = document.getElementsByClassName("strip");

        return new MVPlayer.MultiStrip(width, height, elements);
    }
});


