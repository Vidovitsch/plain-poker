require('dotenv').config();
const http = require('http');
const gatewayProvider = require('D:\\Documents\\Fonyts\\Semester 6\\DPI\\Casus\\plain-poker-gateway');
const LobbyHandler = require('./handlers/lobbyHandler');
const TableManager = require('./services/tableManager');

const tableManger = new TableManager();

const lobbyHandler = new LobbyHandler(gatewayProvider, tableManger);
lobbyHandler.setHandlers();

const server = http.createServer();
server.listen(process.env.PORT);
