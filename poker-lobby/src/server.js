// Load set environment variables from .env file
require('dotenv').config();

// const gateway = require('plain-poker-gateway');
// Dev
const gateway = require('D:\\Documents\\Fonyts\\Semester 6\\DPI\\Casus\\plain-poker-gateway');

const Lobby = require('./models/lobby');

// Only one instance in the entire module!
const lobby = new Lobby('Henkie');

// Create a gateway to communicate with client components
const clientGateway = gateway.createClientGateway({
  websocket: {
    port: process.env.PORT,
  },
});
const tableGateway = gateway.createTableGateway({
  amqp: {
    host: process.env.RMQ_HOST,
    exchange: process.env.RMQ_EXCHANGE,
  },
});

// Set listeners and handlers
clientGateway.onClientConnected((client) => {
  console.log(`connected: ${client.id}`);
  clientGateway.onClientDisconnected(client, () => {
    console.log(`diconnected: ${client.id}`);
  });
  clientGateway.onLobbyRequest(client, () => {
    clientGateway.replyLobby(lobby);
  });
});

tableGateway.onLobbyUpdate((err, message) => {
  console.log('update received');
  console.log(message);
});
