/**
 * [LobbyHandler description]
 * @param       {[type]} gatewayProvider [description]
 * @param       {[type]} gamesManager    [description]
 * @constructor
 */
function LobbyHandler(gatewayProvider, tableManager) {
  this.gatewayProvider = gatewayProvider;
  this.tableManager = tableManager;
  this.clientAmqpGateway = gatewayProvider.getClientGateway('amqp');
  this.lobbyAmqpGateway = gatewayProvider.getLobbyGateway('amqp');
}

/**
 * [setCreateTableHandler description]
 * @param {[type]} clientAmqpGateway [description]
 * @param {[type]} lobbyAmqpGateway  [description]
 * @param {[type]} tableManager      [description]
 */
const setCreateTableHandler = (clientAmqpGateway, lobbyAmqpGateway, tableManager, channelKey) => {
  clientAmqpGateway.onCreateTableRequest(channelKey, (err, requestMessage) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Create table request received from ${requestMessage.data.sessionId}`);
      tableManager.createTableAsync(requestMessage.data.options, requestMessage.data.sessionId).then((table) => {
        // Send reply to the client that requested a table creation
        clientAmqpGateway.sendCreateTableReplyAsync(table, requestMessage).then(() => {
          console.log(`Create table reply sent to ${requestMessage.data.sessionId}`);
        }).catch((ex) => {
          console.log(ex);
        });

        // Send a update to the lobby in the shape of a table item
        const tableItem = tableManager.convertToTableItem(table);
        lobbyAmqpGateway.sendLobbyUpdateAsync(tableItem).then(() => {
          console.log(`Lobby update sent for created table '${tableItem.name}'`);
        }).catch((ex) => {
          console.log(ex);
        });
      }).catch((ex) => {
        console.log(ex);
      });
    }
  });
};

/**
 * [setJoinTableHandler description]
 * @param {[type]} clientAmqpGateway [description]
 * @param {[type]} lobbyAmqpGateway  [description]
 * @param {[type]} tableManager      [description]
 */
const setJoinTableHandler = (clientAmqpGateway, lobbyAmqpGateway, tableManager, channelKey) => {
  clientAmqpGateway.onJoinTableRequest(channelKey, (err, requestMessage) => {
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
L.startHandlers = function startHandlers(channelKey) {
  setCreateTableHandler(this.clientAmqpGateway, this.lobbyAmqpGateway, this.tableManager, channelKey);
  setJoinTableHandler(this.clientAmqpGateway, this.lobbyAmqpGateway, this.tableManager, channelKey);
};

module.exports = LobbyHandler;
