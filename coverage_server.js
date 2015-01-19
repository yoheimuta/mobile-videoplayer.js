var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req, resp){
    req.pipe(fs.createWriteStream('coverage.json'));
    resp.end();
    console.log("Receiving coverage.json");
})

module.exports = function(config, data, done) {
    var port = 7359;
    server.listen(port);

    console.log('Listening to coverage info on', port);
    done();
}
