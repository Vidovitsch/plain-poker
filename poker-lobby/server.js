require('dotenv').config();
const logger = require('./src/util/logger');
const gatewayConfig = require('./src/util/gatewayConfig');
const gatewayProvider = require('D:\\Documents\\Fonyts\\Semester 6\\DPI\\Casus\\plain-poker-gateway')(gatewayConfig);
const LobbyManager = require('./src/services/lobbyManager');
const ClientHandler = require('./src/handlers/clientHandler');

// One connection with one channel for default listening to events
gatewayProvider.createSharedChannelAsync('default', 'default').then(() => {
  const lobbyManager = LobbyManager.getInstance();
  const clientHandler = ClientHandler.getInstance(lobbyManager);
  if (clientHandler.start(gatewayProvider, 'default')) {
    logger.info(`Lobby services started successfully => 127.0.0.1:${process.env.PORT}`);
  } else {
    logger.warn('Not all lobby services have been started correctly');
  }
});

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught exception: ${err}`);
});
