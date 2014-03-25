// signal server for webrtc
var io = require('socket.io');
//io.on('connection', function(socket){});
websockets = io.listen(8888);
websockets.set('log level', 1);


// static server for raw files
var static = require('node-static');
var file = new static.Server('./public');
require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
}).listen(8080);

