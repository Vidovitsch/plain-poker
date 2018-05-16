require('dotenv').config();
const logger = require('./src/util/logger');
const gatewayConfig = require('./src/util/gatewayConfig');
const gatewayProvider = require('D:\\Documents\\Fonyts\\Semester 6\\DPI\\Casus\\plain-poker-gateway')(gatewayConfig);
const DealerManager = require('./src/services/dealerManager');
const TableHandler = require('./src/handlers/tableHandler');

// One connection with one channel for default listening to events
gatewayProvider.createSharedChannelAsync('default', 'default').then(() => {
  const dealerManager = DealerManager.getInstance(gatewayProvider);
  const tableHandler = TableHandler.getInstance(dealerManager);
  if (tableHandler.start(gatewayProvider, 'default')) {
    logger.info(`Dealer services started successfully => 127.0.0.1:${process.env.PORT}`);
  } else {
    logger.warn('Not all dealer services have been started correctly');
  }
}).catch((err) => {
  logger.error(err);
});

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught exception: ${err}`);
});
