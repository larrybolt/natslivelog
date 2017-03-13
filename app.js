// @flow
//
const config = require('./config.js');
const logger = require('winston');
const isText = require('istextorbinary').isText;

// express socketio app
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

// nats 
const nats = require('nats');
const natsServers = config.natsServers;
const nc = nats.connect({ 
  // always select first server first
  'dontRandomize': false,
  'servers': natsServers, 
  //To prevent payload conversion from a Buffer to a string, set the 
  // preserveBuffers option to true. Message payload return will be a Buffer..
  'preserveBuffers': false
});
// currentServer is the URL of the connected server.
logger.info(`connected to nats (host=${nc.currentServer.url.host})`);

const binaryToHexDisplay = require('./common').binaryToHexDisplay;

// subscribe to all nats
nc.subscribe('>', (data, replyto, subject) => {
  isText(null, data, (err, isDataText) => {
    if (!data || data.length === 0) {
      displayLog(subject, '(none)', replyto);
    }
    else if (!isDataText) {
      const maxBytesToShow = 30;
      let dataArray = Buffer.from(data).toJSON().data;
      if (dataArray.length > maxBytesToShow) {
        data = binaryToHexDisplay(dataArray.slice(0,maxBytesToShow));
        data += ` ... (${dataArray.length} bytes)`;
      } else {
        data = binaryToHexDisplay(dataArray);
      }
      displayLog(subject, data, replyto);
    } else {
      displayLog(subject, data, replyto);
    }
  });
});
// function to display result from nats
const displayLog = (subject, data, replyto = false) => {
  io.emit('log', {
    subject: subject,
    data: data,
    replyto: replyto
  });
};

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});