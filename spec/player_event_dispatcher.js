describe("player_event_dispather", function() {
    var is_debug = true;
    var did_start_url;
    var did_resume_url;
    var did_complete_url;
    var first_quartile_url;
    var midpoint_url;
    var third_quartile_url;
    var did_pause_url;

    it("constructor", function (){
        var dispatcher = createDispatcher();
        expect(dispatcher.is_debug).toBeTruthy();
        expect(dispatcher.did_start_url).toBeUndefined();
        expect(dispatcher.did_resume_url).toBeUndefined();
        expect(dispatcher.did_complete_url).toBeUndefined();
        expect(dispatcher.first_quartile_url).toBeUndefined();
        expect(dispatcher.midpoint_url).toBeUndefined();
        expect(dispatcher.third_quartile_url).toBeUndefined();
        expect(dispatcher.did_pause_url).toBeUndefined();
    });

    function createDispatcher() {
        return new MVPlayer.PlayerEventDispatcher(is_debug, did_start_url, did_resume_url, did_complete_url, first_quartile_url, midpoint_url, third_quartile_url, did_pause_url);
    }
});

