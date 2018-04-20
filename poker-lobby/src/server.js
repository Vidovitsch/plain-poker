'use strict';

require('dotenv').config();

const gateway = require('plain-poker-gateway');

const clientGateway = gateway.createClientGateway({
    websocket: {
        port: process.env.PORT,
    }
});

clientGateway.onClientConnected(client => {
    console.log('connected: ' + client.id);

    clientGateway.onClientDisconnected(client, (client) => {
        console.log('diconnected: ' + client.id);
    });
});
