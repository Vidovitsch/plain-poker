'use strict';

// Load set environment variables from .env file
require('dotenv').config();

const http = require('http');
// const gateway = require('plain-poker-gateway');
// Dev
const gateway = require('D:\\Documents\\Fonyts\\Semester 6\\DPI\\Casus\\plain-poker-gateway');
const Table = require('./models/table');

const tables = {};

const server = http.createServer();
server.listen(process.env.PORT);

// Create a gateway to communicate with client components
const clientGateway = gateway.createClientGateway({
    amqp: {
        host: process.env.RMQ_HOST,
        exchange: process.env.RMQ_EXCHANGE,
    },
});
const lobbyGateway = gateway.createLobbyGateway({
    amqp: {
        host: process.env.RMQ_HOST,
        exchange: process.env.RMQ_EXCHANGE,
    },
});

clientGateway.onTableCreationRequest((request) => {
    const table = new Table(request.data);
    let replyData = {};
    if (table.addPlayer(request.replyTo)) {
        tables[table.id] = table;
        replyData = table;
    } else {
        replyData = new Error('is full');
    }
    clientGateway.sendTableCreationReply(replyData, request).then(() => {
        lobbyGateway.sendLobbyUpdate(table);
        console.log('table creation reply sent');
    }).catch((err) => {
        console.log(err);
    });
});

clientGateway.onTableRemovalRequest((request) => {
    console.log(request);
});

clientGateway.onTableUpdatenRequest((request) => {
    console.log(request);
});

clientGateway.onTableJoinRequest((request) => {
    console.log(request);
});
