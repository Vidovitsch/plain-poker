require('dotenv').config();
const http = require('http');
const LobbyHandler = require('./handlers/lobbyHandler');
const TableManager = require('./services/tableManager');
const gatewayProvider = require('D:\\Documents\\Fonyts\\Semester 6\\DPI\\Casus\\plain-poker-gateway')({
  amqp: {
    host: process.env.RMQ_HOST,
    exchange: process.env.RMQ_EXCHANGE,
  },
});

// One connection with one channel for to listen to table updates
gatewayProvider.createSharedChannelAsync('default', 'default').then(() => {
  const tableManager = new TableManager(gatewayProvider);
  const lobbyHandler = new LobbyHandler(gatewayProvider, tableManager);
  // Start handlers that listen on the 'default' channel
  lobbyHandler.startHandlers('default');
});

const server = http.createServer();
server.listen(process.env.PORT);
