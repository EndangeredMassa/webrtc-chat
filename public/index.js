(function(){
  var channels = {};
  var currentUserUUID = Math.round(Math.random() * 60535) + 5000;
  var socketio = io.connect('http://localhost:8888/');

  socketio.on('message', function(data) {
    if(data.sender == currentUserUUID) return;

    if (channels[data.channel] && channels[data.channel].onmessage) {
      channels[data.channel].onmessage(data.message);
    };
  });


  // global for easy debugging
  window.connection = new RTCMultiConnection('conference-demo');

  connection.session = {
    audio: true,
    video: true,
    data: true
  };

  // on getting local or remote media stream
  connection.onstream = function(e) {
    document.body.appendChild(e.mediaElement);
  };

  connection.onmessage = function(e) {
    console.log('onmessage:')
    console.log(e);
  }

  connection.onopen = function(e) {
    console.log('onopen:')
    console.log(e);
  }

  connection.openSignalingChannel = function (config) {
    var channel = config.channel || this.channel;
    channels[channel] = config;

    if (config.onopen) setTimeout(config.onopen, 1000);

    return {
      send: function (message) {
        socketio.emit('message', {
          sender: currentUserUUID,
          channel: channel,
          message: message
        });
      },
      channel: channel
    };
  };

  // setup signaling channel
  connection.connect('room-1');

  // open new session
  document.querySelector('#openNewSessionButton').onclick = function() {
    connection.open('room-1');
    connection.send('hey there!');
  };

})();
