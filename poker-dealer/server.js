require('dotenv').config();

const gatewayConfig = {
  amqp: {
    host: process.env.RMQ_HOST,
    exchange: process.env.RMQ_EXCHANGE,
  },
};

const dealerManager = require('./src/services/dealerManager').getInstance();
const gatewayProvider = require('D:\\Documents\\Fonyts\\Semester 6\\DPI\\Casus\\plain-poker-gateway')(gatewayConfig);
const tableHandler = require('./src/handlers/tableHandler').getInstance(gatewayProvider, dealerManager);

// One connection with one channel for to listen to lobby update
gatewayProvider.createSharedChannelAsync('default', 'default').then(() => {
  tableHandler.startHandlers('default');
}).catch((err) => {
  console.log(err);
});
