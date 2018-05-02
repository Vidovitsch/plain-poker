function CrudHandler(gatewayProvider, tableManager) {
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

const C = CrudHandler.prototype;

C.startHandlers = function startHandlers() {
  // Create table request/reply
  this.clientAmqpGateway.onCreateTableRequest((requestMessage) => {
    console.log(requestMessage);
    const table = this.tableManager.createTable(requestMessage.replyTo, requestMessage.data);
    this.clientAmqpGateway.sendCreateTableReply(table, requestMessage);

    const tableItem = this.tableManager.getTableItem(table);
    this.lobbyAmqpGateway.sendLobbyUpdate(tableItem);
  });
};

module.exports = CrudHandler;
