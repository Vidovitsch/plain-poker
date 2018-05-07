/**
 * [LobbyHandler description]
 * @param       {[type]} gatewayProvider [description]
 * @param       {[type]} tableManager    [description]
 * @constructor
 */
function LobbyHandler(gatewayProvider, tableManager) {
  this.gatewayProvider = gatewayProvider;
  this.tableManager = tableManager;
}

/**
 * [setCreateTableHandler description]
 * @param {[type]} clientAmqpGateway [description]
 * @param {[type]} lobbyAmqpGateway  [description]
 * @param {[type]} tableManager      [description]
 */
const setCreateTableHandler = (clientAmqpGateway, lobbyAmqpGateway, tableManager) => {
  clientAmqpGateway.onCreateTableRequest((err, requestMessage) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Create table request received from ${requestMessage.data.sessionId}`);
      const result = tableManager.createTable(requestMessage.data.sessionId, requestMessage.data.options);
      if (result instanceof Error) {
        console.log(result);
      } else {
        clientAmqpGateway.sendCreateTableReplyAsync(result, requestMessage).then(() => {
          console.log(`Create table reply sent to ${requestMessage.data.sessionId}`);
        }).catch((ex) => {
          console.log(ex);
        });
        const tableItem = tableManager.convertToTableItem(result);
        lobbyAmqpGateway.sendLobbyUpdateAsync(tableItem).then(() => {
          console.log(`Lobby update sent for created table '${tableItem.name}'`);
        }).catch((ex) => {
          console.log(ex);
        });
      }
    }
  });
};

/**
 * [setJoinTableHandler description]
 * @param {[type]} clientAmqpGateway [description]
 * @param {[type]} lobbyAmqpGateway  [description]
 * @param {[type]} tableManager      [description]
 */
const setJoinTableHandler = (clientAmqpGateway, lobbyAmqpGateway, tableManager) => {
  clientAmqpGateway.onJoinTableRequest((err, requestMessage) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Join table request received from ${requestMessage.data.sessionId}`);
      const result = tableManager.joinTable(requestMessage.data.tableId, requestMessage.data.sessionId);
      if (result instanceof Error) {
        console.log(result);
      } else {
        clientAmqpGateway.sendJoinTableReplyAsync(result, requestMessage).then(() => {
          console.log(`Join table reply sent to ${requestMessage.data.sessionId}`);
        }).catch((ex) => {
          console.log(ex);
        });
        const tableItem = tableManager.convertToTableItem(result);
        lobbyAmqpGateway.sendLobbyUpdateAsync(tableItem).then(() => {
          console.log(`Lobby update sent for created table ${tableItem.name}`);
        }).catch((ex) => {
          console.log(ex);
        });
      }
    }
  });
};

const L = LobbyHandler.prototype;

/**
 * [setHandlers description]
 */
L.setHandlers = function setHandlers() {
  setCreateTableHandler(this.clientAmqpGateway, this.lobbyAmqpGateway, this.tableManager);
  setJoinTableHandler(this.clientAmqpGateway, this.lobbyAmqpGateway, this.tableManager);
};

L.createGatewaysAsync = function createGatewaysAsync() {
  return new Promise((resolve, reject) => {
    this.gatewayProvider.getClientGatewayAsync('amqp', {
      host: process.env.RMQ_HOST,
      port: process.env.RMQ_PORT,
    }).then((clientAmqpGateway) => {
      this.clientAmqpGateway = clientAmqpGateway;
      return this.gatewayProvider.getLobbyGatewayAsync('amqp', {
        host: process.env.RMQ_HOST,
        port: process.env.RMQ_PORT,
      });
    }).then((lobbyAmqpGateway) => {
      this.lobbyAmqpGateway = lobbyAmqpGateway;
      resolve();
    }).catch((err) => {
      reject(err);
    });
  });
};

module.exports = LobbyHandler;
