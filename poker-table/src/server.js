require('dotenv').config();
const http = require('http');
const gatewayProvider = require('D:\\Documents\\Fonyts\\Semester 6\\DPI\\Casus\\plain-poker-gateway');
const ClientHandler = require('./handlers/clientHandler');
const TableManager = require('./services/tableManager');

const tableManger = new TableManager();

const clientHandler = new ClientHandler(gatewayProvider, tableManger);
clientHandler.startHandlers();

const server = http.createServer();
server.listen(process.env.PORT);
