require('dotenv').config();
const logger = require('./src/util/logger');
const http = require('http');
const gatewayConfig = require('./src/util/gatewayConfig');
const gatewayProvider = require('D:\\Documents\\Fonyts\\Semester 6\\DPI\\Casus\\plain-poker-gateway')(gatewayConfig);
const DealerManager = require('./src/services/dealerManager');
const TableHandler = require('./src/handlers/tableHandler');

// One connection with one channel for default listening to events
gatewayProvider.createSharedChannelAsync('default', 'default').then(() => {
  const dealerManager = DealerManager.getInstance(gatewayProvider);
  const tableHandler = TableHandler.getInstance(dealerManager);
  if (tableHandler.start(gatewayProvider, 'default')) {
    logger.info(`(dealer) Services started successfully => [port:${process.env.PORT}]`);
  } else {
    logger.warn('(dealer) Not all services have been started correctly');
  }
}).catch((err) => {
  logger.error(err);
});

const server = http.createServer();
server.listen(process.env.PORT);

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught exception: ${err}`);
});
