require('dotenv').config();

const gatewayConfig = {
  amqp: {
    host: process.env.RMQ_HOST,
    exchange: process.env.RMQ_EXCHANGE,
  },
  ws: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
};

const dealerManager = require('./src/services/dealerManager').getInstance();
const gatewayProvider = require('D:\\Documents\\Fonyts\\Semester 6\\DPI\\Casus\\plain-poker-gateway')(gatewayConfig);
const gameHandler = require('./src/handlers/gameHandler').getInstance(gatewayProvider, dealerManager);

// One connection with one channel for to listen to lobby update
gatewayProvider.createSharedChannelAsync('default', 'default').then(() => {
  const lobbyManager = new LobbyManager();
  const clientHandler = new ClientHandler(gatewayProvider, lobbyManager);
  // Start handlers that listen on the 'default' channel
  clientHandler.startHandlers('default');
});
