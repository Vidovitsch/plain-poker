/**
 * [LobbyHandler description]
 * @param       {[type]} sessionId       [description]
 * @param       {[type]} gatewayProvider [description]
 * @param       {[type]} ipcMain         [description]
 * @constructor
 */
function LobbyHandler(sessionId, gatewayProvider, ipcMain) {
  this.sessionId = sessionId;
  this.gatewayProvider = gatewayProvider;
  this.ipcMain = ipcMain;
  this.lobbySocketGateway = {};
  this.isConnected = false;
  this.tableAmqpGateway = gatewayProvider.getTableGateway('amqp', {
    host: process.env.RMQ_HOST,
    exchange: process.env.RMQ_EXCHANGE,
  });
  this.disconnectFromLobby = this.disconnectFromLobby.bind(this);
}

/**
 * [setLobbyRequestHandler description]
 * @param {Object} ipcMain            [description]
 * @param {Object} lobbySocketGateway [description]
 */
const setLobbyRequestHandler = (ipcMain, lobbySocketGateway) => {
  ipcMain.on('lobby-request', (e) => {
    lobbySocketGateway.sendLobbyRequest().then((replyMessage) => {
      lobbySocketGateway.onLobbyUpdate((err, message) => {
        e.sender.send('lobby-update', message.data.tableItems);
      });
      e.sender.send('lobby-reply', replyMessage.data.tableItems);
    }).catch((err) => {
      console.log(err);
    });
  });
};

/**
 * [setRequestTableHandler description]
 * @param {Object} ipcMain          [description]
 * @param {Object} tableAmqpGateway [description]
 * @param {function} disconnect       [description]
 */
const setCreateTableHandler = (ipcMain, tableAmqpGateway, sessionId, disconnectFromLobby) => {
  ipcMain.on('create-table-request', (e, data) => {
    tableAmqpGateway.sendCreateTableRequest(sessionId, data).then((replyMessage) => {
      e.sender.send('create-table-reply', {
        sessionId,
        tableId: replyMessage.data.id,
      });
      disconnectFromLobby();
    }).catch((err) => {
      console.log(err);
    });
  });
};

/**
 * [setJoinTableHandler description]
 * @param {Object} ipcMain          [description]
 * @param {Object} tableAmqpGateway [description]
 * @param {function} disconnect       [description]
 */
const setJoinTableHandler = (ipcMain, tableAmqpGateway, sessionId, disconnectFromLobby) => {
  ipcMain.on('join-table-request', (e, data) => {
    tableAmqpGateway.sendJoinTableRequest(sessionId, data).then((replyMessage) => {
      e.sender.send('join-table-reply', {
        sessionId,
        tableId: replyMessage.data.id,
      });
      disconnectFromLobby();
    }).catch((err) => {
      console.log(err);
    });
  });
};

const L = LobbyHandler.prototype;

/**
 * [connect description]
 * @return {Promise} [description]
 */
L.connectToLobbyAsync = function connectToLobbyAsync() {
  return new Promise((resolve, reject) => {
    if (!this.isConnected) {
      this.lobbySocketGateway = this.gatewayProvider.getLobbyGateway('socket', {
        host: process.env.LOBBY_HOST,
        port: process.env.LOBBY_PORT,
      });
      this.lobbySocketGateway.onConnected(() => {
        this.isConnected = true;
        resolve();
      });
    } else {
      reject(new Error('Already connected to lobby'));
    }
  });
};

/**
 * [disconnectFromLobby description]
 * @return {boolean} [description]
 */
L.disconnectFromLobby = function disconnectFromLobby() {
  if (this.isConnected) {
    this.lobbySocketGateway.disconnect();
    this.isConnected = false;
    console.log('Disconnected from lobby');
  } else {
    throw new Error('Already disconnected from lobby');
  }
};

/**
 * [initHandlers description]
 * @return {[type]} [description]
 */
L.setHandlers = function setHandlers() {
  setLobbyRequestHandler(this.ipcMain, this.lobbySocketGateway);
  setCreateTableHandler(this.ipcMain, this.tableAmqpGateway, this.sessionId, this.disconnectFromLobby);
  setJoinTableHandler(this.ipcMain, this.tableAmqpGateway, this.sessionId, this.disconnectFromLobby);
};

module.exports = LobbyHandler;
