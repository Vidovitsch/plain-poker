require('dotenv').config();
const ClientHandler = require('./handlers/clientHandler');
const LobbyManager = require('./services/lobbyManager');
const gatewayProvider = require('D:\\Documents\\Fonyts\\Semester 6\\DPI\\Casus\\plain-poker-gateway')({
  amqp: {
    host: process.env.RMQ_HOST,
    exchange: process.env.RMQ_EXCHANGE,
  },
  ws: {
    port: process.env.PORT,
  },
});

// One connection with one channel for to listen to lobby update
gatewayProvider.createSharedChannelAsync('default', 'default').then(() => {
  const lobbyManager = new LobbyManager();
  const clientHandler = new ClientHandler(gatewayProvider, lobbyManager);
  // Start handlers that listen on the 'default' channel
  clientHandler.startHandlers('default');
});
