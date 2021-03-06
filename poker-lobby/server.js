require('dotenv').config();
const logger = require('./src/util/logger');
const gatewayConfig = require('./src/util/gatewayConfig');
const gatewayProvider = require('plain-poker-gateway')(gatewayConfig);
const LobbyManager = require('./src/services/lobbyManager');
const ClientHandler = require('./src/handlers/clientHandler');

// One connection with one channel for default listening to events
gatewayProvider.createSharedChannelAsync('default', 'default').then(() => {
  const lobbyManager = LobbyManager.getInstance();
  const clientHandler = ClientHandler.getInstance(lobbyManager);
  if (clientHandler.start(gatewayProvider, 'default')) {
    logger.info(`(lobby) Services started successfully => [port:${process.env.PORT}]`);
  } else {
    logger.warn('(lobby) Not all services have been started correctly');
  }
});

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught exception: ${err}`);
});
