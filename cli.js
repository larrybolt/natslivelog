// @flow
//
const config = require('./config.js');
const logger = require('winston');
const isText = require('istextorbinary').isText;

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
  console.log(`${subject}: \r\n  ${data}`);
  if (replyto) console.log('  -reply->' + replyto);
};