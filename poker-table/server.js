require('dotenv').config();
const logger = require('./src/util/logger');
const gatewayConfig = require('./src/util/gatewayConfig');
const gatewayProvider = require('plain-poker-gateway')(gatewayConfig);
const http = require('http');
const LobbyHandler = require('./src/handlers/lobbyHandler');
const TableManager = require('./src/services/tableManager');


// One connection with one channel for to listen to table updates
gatewayProvider.createSharedChannelAsync('default', 'default').then(() => {
  const tableManager = TableManager.getInstance(gatewayProvider);
  const lobbyHandler = LobbyHandler.getInstance(tableManager);
  if (lobbyHandler.start(gatewayProvider, 'default')) {
    logger.info(`(table) Services started successfully => [port:${process.env.PORT}]`);
  } else {
    logger.warn('(table) Not all services have been started correctly');
  }
});

const server = http.createServer();
server.listen(process.env.PORT);

process.on('uncaughtException', (err) => {
  console.log(`Caught exception: ${err}`);
});
