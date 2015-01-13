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
    });

    describe("play", function() {
        it("init", function (){
            var player = createPlayer();

            spyOn(player.dispatcher, "didStart");
            spyOn(player.dispatcher, "didResume");
            spyOn(player.dispatcher, "didFinish");
            spyOn(player.dispatcher, "firstQuartile");
            spyOn(player.dispatcher, "half");
            spyOn(player.dispatcher, "thirdQuartile");

            player.play();
            expect(player.dispatcher.didStart).toHaveBeenCalled();
            expect(player.dispatcher.didResume).not.toHaveBeenCalled();
            expect(player.dispatcher.didFinish).not.toHaveBeenCalled();
            expect(player.dispatcher.firstQuartile).not.toHaveBeenCalled();
            expect(player.dispatcher.half).not.toHaveBeenCalled();
            expect(player.dispatcher.thirdQuartile).not.toHaveBeenCalled();
            expect(player.timerId).toBeDefined();
        });

        it("firstQuartile", function (){
            jasmine.clock().install();

            var player = createPlayer();

            spyOn(player.dispatcher, "didFinish");
            spyOn(player.dispatcher, "firstQuartile");
            spyOn(player.dispatcher, "half");
            spyOn(player.dispatcher, "thirdQuartile");

            player.play();
            jasmine.clock().tick(100 * 36);
            expect(player.dispatcher.didFinish).not.toHaveBeenCalled();
            expect(player.dispatcher.firstQuartile).not.toHaveBeenCalled();
            expect(player.dispatcher.half).not.toHaveBeenCalled();
            expect(player.dispatcher.thirdQuartile).not.toHaveBeenCalled();

            jasmine.clock().tick(101);
            expect(player.dispatcher.firstQuartile).toHaveBeenCalled();

            jasmine.clock().uninstall();
        });

        it("half", function (){
            jasmine.clock().install();

            var player = createPlayer();

            spyOn(player.dispatcher, "didFinish");
            spyOn(player.dispatcher, "firstQuartile");
            spyOn(player.dispatcher, "half");
            spyOn(player.dispatcher, "thirdQuartile");

            player.play();
            jasmine.clock().tick(100 * 74);
            expect(player.dispatcher.didFinish).not.toHaveBeenCalled();
            expect(player.dispatcher.firstQuartile).toHaveBeenCalled();
            expect(player.dispatcher.half).not.toHaveBeenCalled();
            expect(player.dispatcher.thirdQuartile).not.toHaveBeenCalled();

            jasmine.clock().tick(101);
            expect(player.dispatcher.half).toHaveBeenCalled();

            jasmine.clock().uninstall();
        });

        it("thirdQuartile", function (){
            jasmine.clock().install();

            var player = createPlayer();

            spyOn(player.dispatcher, "didFinish");
            spyOn(player.dispatcher, "firstQuartile");
            spyOn(player.dispatcher, "half");
            spyOn(player.dispatcher, "thirdQuartile");

            player.play();
            jasmine.clock().tick(100 * 112);
            expect(player.dispatcher.didFinish).not.toHaveBeenCalled();
            expect(player.dispatcher.firstQuartile).toHaveBeenCalled();
            expect(player.dispatcher.half).toHaveBeenCalled();
            expect(player.dispatcher.thirdQuartile).not.toHaveBeenCalled();

            jasmine.clock().tick(101);
            expect(player.dispatcher.thirdQuartile).toHaveBeenCalled();

            jasmine.clock().uninstall();
        });

        it("didFinish", function (){
            jasmine.clock().install();

            var player = createPlayer();

            spyOn(player.dispatcher, "didFinish");
            spyOn(player.dispatcher, "didPause");
            spyOn(player.dispatcher, "firstQuartile");
            spyOn(player.dispatcher, "half");
            spyOn(player.dispatcher, "thirdQuartile");

            player.play();
            jasmine.clock().tick(100 * 151);
            expect(player.dispatcher.didFinish).not.toHaveBeenCalled();
            expect(player.dispatcher.firstQuartile).toHaveBeenCalled();
            expect(player.dispatcher.half).toHaveBeenCalled();
            expect(player.dispatcher.thirdQuartile).toHaveBeenCalled();

            jasmine.clock().tick(101);
            expect(player.dispatcher.didFinish).toHaveBeenCalled();
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
