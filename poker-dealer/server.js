require('dotenv').config();
const logger = require('./src/util/logger');

const gatewayConfig = {
  amqp: {
    host: process.env.RMQ_HOST,
    exchange: process.env.RMQ_EXCHANGE,
  },
};

const gatewayProvider = require('D:\\Documents\\Fonyts\\Semester 6\\DPI\\Casus\\plain-poker-gateway')(gatewayConfig);
const dealerManager = require('./src/services/dealerManager').getInstance(gatewayProvider);
const tableHandler = require('./src/handlers/tableHandler').getInstance(gatewayProvider, dealerManager);

// One connection with one channel for to listen to lobby update
gatewayProvider.createSharedChannelAsync('default', 'default').then(() => {
  tableHandler.startAllHandlers('default');
}).catch((err) => {
  console.log(err);
});

process.on('uncaughtException', (err) => {
  console.log(`Caught exception: ${err}`);
});

logger.error('test');
