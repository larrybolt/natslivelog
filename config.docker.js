module.exports = Object.assign(require('./config.dist.js'), {
  mongodburi: process.env.MONGO_URL,
  natsServers: [process.env.NATS_URL]
});