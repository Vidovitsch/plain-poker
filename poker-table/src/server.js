require('dotenv').config();
const http = require('http');
const gatewayProvider = require('D:\\Documents\\Fonyts\\Semester 6\\DPI\\Casus\\plain-poker-gateway');
const CrudHandler = require('./handlers/crudHandler');
const TableManager = require('./services/tableManager');

const tableManger = new TableManager();

const crudHandler = new CrudHandler(gatewayProvider, tableManger);
crudHandler.startHandlers();

const server = http.createServer();
server.listen(process.env.PORT);
