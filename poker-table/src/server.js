'use strict';

// Load set environment variables from .env file
require('dotenv').config();

const http = require('http');

// const gateway = require('plain-poker-gateway');
// Dev
const gateway = require('D:\\Documents\\Fonyts\\Semester 6\\DPI\\Casus\\plain-poker-gateway');

const Table = require('./models/table');

const server = http.createServer();
server.listen(process.env.PORT);

// Create a gateway to communicate with client components
const clientGateway = gateway.createClientGateway({
    amqp: {
        host: process.env.RMQ_HOST,
        exchange: process.env.RMQ_EXCHANGE,
    },
});

clientGateway.connectReceiverToBroker().then(() => {
    clientGateway.onMessage((err, message) => {
        if (err) {
            console.log(err);
        } else {
            console.log(message);
        }
    });
}).catch((err) => {
    console.log(err);
});
