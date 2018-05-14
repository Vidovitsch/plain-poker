require('dotenv').config();
const http = require('http');
const LobbyHandler = require('./handlers/lobbyHandler');
const GamesManager = require('./services/gamesManager');
const gatewayProvider = require('D:\\Documents\\Fonyts\\Semester 6\\DPI\\Casus\\plain-poker-gateway')({
  amqp: {
    host: process.env.RMQ_HOST,
    exchange: process.env.RMQ_EXCHANGE,
  },
});

// One connection with one channel for to listen to table updates
gatewayProvider.createSharedChannelAsync('default', 'default').then(() => {
  const gamesManager = new GamesManager(gatewayProvider);
  const lobbyHandler = new LobbyHandler(gatewayProvider, gamesManager);
  // Start handlers that listen on the 'default' channel
  lobbyHandler.startHandlers('default');
});

const server = http.createServer();
server.listen(process.env.PORT);
