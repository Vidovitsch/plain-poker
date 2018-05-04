/**
 * [LobbyHandler description]
 * @param       {[type]} gatewayProvider [description]
 * @param       {[type]} tableManager    [description]
 * @constructor
 */
function LobbyHandler(gatewayProvider, tableManager) {
  this.gatewayProvider = gatewayProvider;
  this.tableManager = tableManager;
  this.clientAmqpGateway = gatewayProvider.getClientGateway('amqp', {
    host: process.env.RMQ_HOST,
    port: process.env.RMQ_PORT,
  });
  this.lobbyAmqpGateway = gatewayProvider.getLobbyGateway('amqp', {
    host: process.env.RMQ_HOST,
    port: process.env.RMQ_PORT,
  });
}

/**
 * [setCreateTableHandler description]
 * @param {[type]} clientAmqpGateway [description]
 * @param {[type]} lobbyAmqpGateway  [description]
 * @param {[type]} tableManager      [description]
 */
const setCreateTableHandler = (clientAmqpGateway, lobbyAmqpGateway, tableManager) => {
  clientAmqpGateway.onCreateTableRequest((requestMessage) => {
    const table = tableManager.createTable(requestMessage.data.sessionId, requestMessage.data.options);
    clientAmqpGateway.sendCreateTableReply(table, requestMessage);

    const tableItem = tableManager.convertToTableItem(table);
    lobbyAmqpGateway.sendLobbyUpdate(tableItem);
  });
};

/**
 * [setJoinTableHandler description]
 * @param {[type]} clientAmqpGateway [description]
 * @param {[type]} lobbyAmqpGateway  [description]
 * @param {[type]} tableManager      [description]
 */
const setJoinTableHandler = (clientAmqpGateway, lobbyAmqpGateway, tableManager) => {
  clientAmqpGateway.onJoinTableRequest((requestMessage) => {
    const table = tableManager.joinTable(requestMessage.data.sessionId, requestMessage.data.tableId);
    clientAmqpGateway.sendJoinTableReply(table, requestMessage);

    const tableItem = tableManager.convertToTableItem(table);
    lobbyAmqpGateway.sendLobbyUpdate(tableItem);
  });
};

const C = LobbyHandler.prototype;

/**
 * [setHandlers description]
 */
C.setHandlers = function setHandlers() {
  setCreateTableHandler(this.clientAmqpGateway, this.lobbyAmqpGateway, this.tableManager);
  setJoinTableHandler(this.clientAmqpGateway, this.lobbyAmqpGateway, this.tableManager);
};

module.exports = LobbyHandler;
