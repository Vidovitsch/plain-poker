/**
 * [LobbyHandler description]
 * @param       {[type]} gatewayProvider [description]
 * @param       {[type]} gamesManager    [description]
 * @constructor
 */
function LobbyHandler(gatewayProvider, gamesManager) {
  this.gatewayProvider = gatewayProvider;
  this.gamesManager = gamesManager;
  this.clientAmqpGateway = gatewayProvider.getClientGateway('amqp');
  this.lobbyAmqpGateway = gatewayProvider.getLobbyGateway('amqp');
}

/**
 * [setCreateTableHandler description]
 * @param {[type]} clientAmqpGateway [description]
 * @param {[type]} lobbyAmqpGateway  [description]
 * @param {[type]} tableManager      [description]
 */
const setCreateTableHandler = (clientAmqpGateway, lobbyAmqpGateway, gamesManager, channelKey) => {
  clientAmqpGateway.onCreateTableRequest(channelKey, (err, requestMessage) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Create table request received from ${requestMessage.data.sessionId}`);
      gamesManager.createTableAsync(requestMessage.data.options, requestMessage.data.sessionId).then((table) => {
        // Send reply to the client that requested a table creation
        clientAmqpGateway.sendCreateTableReplyAsync(table, requestMessage).then(() => {
          console.log(`Create table reply sent to ${requestMessage.data.sessionId}`);
        }).catch((ex) => {
          console.log(ex);
        });

        // Send a update to the lobby in the shape of a table item
        const tableItem = gamesManager.convertToTableItem(table);
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
const setJoinTableHandler = (clientAmqpGateway, lobbyAmqpGateway, gamesManager, channelKey) => {
  clientAmqpGateway.onJoinTableRequest(channelKey, (err, requestMessage) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Join table request received from ${requestMessage.data.sessionId}`);
      const result = gamesManager.joinTable(requestMessage.data.tableId, requestMessage.data.sessionId);
      if (result instanceof Error) {
        console.log(result);
      } else {
        clientAmqpGateway.sendJoinTableReplyAsync(result, requestMessage).then(() => {
          console.log(`Join table reply sent to ${requestMessage.data.sessionId}`);
        }).catch((ex) => {
          console.log(ex);
        });
        const tableItem = gamesManager.convertToTableItem(result);
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
  setCreateTableHandler(this.clientAmqpGateway, this.lobbyAmqpGateway, this.gamesManager, channelKey);
  setJoinTableHandler(this.clientAmqpGateway, this.lobbyAmqpGateway, this.gamesManager, channelKey);
};

module.exports = LobbyHandler;
