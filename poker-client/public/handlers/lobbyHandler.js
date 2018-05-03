function LobbyHandler(sessionId, gatewayProvider, ipcMain) {
  this.sessionId = sessionId;
  this.gatewayProvider = gatewayProvider;
  this.ipcMain = ipcMain;
  this.isConnected = false;
  this.tableAmqpGateway = gatewayProvider.getTableGateway('amqp', {
    host: process.env.RMQ_HOST,
    exchange: process.env.RMQ_EXCHANGE,
  });
  this.lobbySocketGateway = null;
}

const L = LobbyHandler.prototype;

L.connectToLobby = function connect() {
  this.lobbySocketGateway = this.gatewayProvider.getLobbyGateway('socket', {
    host: process.env.LOBBY_HOST,
    port: process.env.LOBBY_PORT,
  });
  return new Promise((resolve) => {
    this.lobbySocketGateway.onConnected(() => {
      console.log('Connected with lobby');
      resolve();
    });
  });
};

L.disconnectFromLobby = function disconnect() {
  if (this.lobbySocketGateway) {
    this.lobbySocketGateway.disconnect();
    this.lobbySocketGateway = null;
  }
};

L.startHandlers = function startHandlers() {
  // Request lobby
  this.ipcMain.on('lobby-request', (e) => {
    this.lobbySocketGateway.sendLobbyRequest().then((replyMessage) => {
      // Keep lobby up to date
      this.lobbySocketGateway.onLobbyUpdate((err, message) => {
        e.sender.send('lobby-update', message.data.tableItems);
      });
      e.sender.send('lobby-reply', replyMessage.data.tableItems);
    }).catch((err) => {
      console.log(err);
    });
  });

  // Request create table
  this.ipcMain.on('create-table-request', (e, data) => {
    console.log('send');
    this.tableAmqpGateway.sendCreateTableRequest(this.sessionId, data).then((replyMessage) => {
      e.sender.send('create-table-reply', {
        sessionId: this.sessionId,
        tableId: replyMessage.data.id,
      });
      this.disconnectFromLobby();
    }).catch((err) => {
      console.log(err);
    });
  });
};

module.exports = LobbyHandler;
