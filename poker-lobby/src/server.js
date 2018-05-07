require('dotenv').config();
const gatewayProvider = require('D:\\Documents\\Fonyts\\Semester 6\\DPI\\Casus\\plain-poker-gateway');
const ClientHandler = require('./handlers/clientHandler');
const LobbyManager = require('./services/lobbyManager');

const lobbyManager = new LobbyManager();

const clientHandler = new ClientHandler(gatewayProvider, lobbyManager);
clientHandler.createGatewaysAsync().then(() => {
  clientHandler.startHandlers();
}).catch((err) => {
  console.log(err);
});
