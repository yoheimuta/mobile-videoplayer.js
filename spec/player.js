describe("player", function() {

    beforeEach(function() {
        jasmine.getFixtures().fixturesPath = 'spec/fixtures';
        loadFixtures('player.html');
    });

    it("constructor", function (){
        var player = createPlayer();
        expect(player.movie).toEqual(jasmine.any(MVPlayer.MultiStrip));
        expect(player.dispatcher).toEqual(jasmine.any(MVPlayer.PlayerEventDispatcher));
        expect(player.fps).toEqual(10);
        expect(player.element.style.width).toEqual("320px");
        expect(player.element.style.height).toEqual("180px");
        expect(player.element.style.position).toEqual("relative");
        expect(player.element.style.overflow).toEqual("hidden");

        expect(player.dispatcher.did_start_url).toEqual("start");
        expect(player.dispatcher.did_resume_url).toEqual("resume");
        expect(player.dispatcher.did_complete_url).toEqual("complete");
        expect(player.dispatcher.first_quartile_url).toEqual("first");
        expect(player.dispatcher.midpoint_url).toEqual("midpoint");
        expect(player.dispatcher.third_quartile_url).toEqual("third");
        expect(player.dispatcher.did_pause_url).toEqual("pause");
    });

    describe("play", function() {
        it("init", function (){
            var player = createPlayer();

            spyOn(player.dispatcher, "didStart");
            spyOn(player.dispatcher, "didResume");
            spyOn(player.dispatcher, "didComplete");
            spyOn(player.dispatcher, "firstQuartile");
            spyOn(player.dispatcher, "midpoint");
            spyOn(player.dispatcher, "thirdQuartile");

            player.play();
            expect(player.dispatcher.didStart).toHaveBeenCalled();
            expect(player.dispatcher.didResume).not.toHaveBeenCalled();
            expect(player.dispatcher.didComplete).not.toHaveBeenCalled();
            expect(player.dispatcher.firstQuartile).not.toHaveBeenCalled();
            expect(player.dispatcher.midpoint).not.toHaveBeenCalled();
            expect(player.dispatcher.thirdQuartile).not.toHaveBeenCalled();
            expect(player.timerId).toBeDefined();
        });

        it("firstQuartile", function (){
            jasmine.clock().install();

            var player = createPlayer();

            spyOn(player.dispatcher, "didComplete");
            spyOn(player.dispatcher, "firstQuartile");
            spyOn(player.dispatcher, "midpoint");
            spyOn(player.dispatcher, "thirdQuartile");

            player.play();
            jasmine.clock().tick(100 * 36);
            expect(player.dispatcher.didComplete).not.toHaveBeenCalled();
            expect(player.dispatcher.firstQuartile).not.toHaveBeenCalled();
            expect(player.dispatcher.midpoint).not.toHaveBeenCalled();
            expect(player.dispatcher.thirdQuartile).not.toHaveBeenCalled();

            jasmine.clock().tick(101);
            expect(player.dispatcher.firstQuartile).toHaveBeenCalled();

            jasmine.clock().uninstall();
        });

        it("midpoint", function (){
            jasmine.clock().install();

            var player = createPlayer();

            spyOn(player.dispatcher, "didComplete");
            spyOn(player.dispatcher, "firstQuartile");
            spyOn(player.dispatcher, "midpoint");
            spyOn(player.dispatcher, "thirdQuartile");

            player.play();
            jasmine.clock().tick(100 * 74);
            expect(player.dispatcher.didComplete).not.toHaveBeenCalled();
            expect(player.dispatcher.firstQuartile).toHaveBeenCalled();
            expect(player.dispatcher.midpoint).not.toHaveBeenCalled();
            expect(player.dispatcher.thirdQuartile).not.toHaveBeenCalled();

            jasmine.clock().tick(101);
            expect(player.dispatcher.midpoint).toHaveBeenCalled();

            jasmine.clock().uninstall();
        });

        it("thirdQuartile", function (){
            jasmine.clock().install();

            var player = createPlayer();

            spyOn(player.dispatcher, "didComplete");
            spyOn(player.dispatcher, "firstQuartile");
            spyOn(player.dispatcher, "midpoint");
            spyOn(player.dispatcher, "thirdQuartile");

            player.play();
            jasmine.clock().tick(100 * 112);
            expect(player.dispatcher.didComplete).not.toHaveBeenCalled();
            expect(player.dispatcher.firstQuartile).toHaveBeenCalled();
            expect(player.dispatcher.midpoint).toHaveBeenCalled();
            expect(player.dispatcher.thirdQuartile).not.toHaveBeenCalled();

            jasmine.clock().tick(101);
            expect(player.dispatcher.thirdQuartile).toHaveBeenCalled();

            jasmine.clock().uninstall();
        });

        it("didComplete", function (){
            jasmine.clock().install();

            var player = createPlayer();

            spyOn(player.dispatcher, "didComplete");
            spyOn(player.dispatcher, "didPause");
            spyOn(player.dispatcher, "firstQuartile");
            spyOn(player.dispatcher, "midpoint");
            spyOn(player.dispatcher, "thirdQuartile");

            player.play();
            jasmine.clock().tick(100 * 151);
            expect(player.dispatcher.didComplete).not.toHaveBeenCalled();
            expect(player.dispatcher.firstQuartile).toHaveBeenCalled();
            expect(player.dispatcher.midpoint).toHaveBeenCalled();
            expect(player.dispatcher.thirdQuartile).toHaveBeenCalled();

            jasmine.clock().tick(101);
            expect(player.dispatcher.didComplete).toHaveBeenCalled();
            expect(player.dispatcher.didPause).not.toHaveBeenCalled();

            jasmine.clock().uninstall();
        });
    });

    it("pause", function() {
        jasmine.clock().install();

        var player = createPlayer();

        spyOn(player.dispatcher, "didPause");
        spyOn(player.dispatcher, "didResume");

        player.play();

        jasmine.clock().tick(100);
        expect(player.dispatcher.didResume).not.toHaveBeenCalled();

        player.pause();
        expect(player.dispatcher.didPause).toHaveBeenCalled();

        player.play();
        expect(player.dispatcher.didResume).toHaveBeenCalled();

        jasmine.clock().uninstall();
    });

    function createPlayer() {
        var element = document.getElementsByClassName("play-scene")[0];
        return new MVPlayer.Player(element);
    }
});
