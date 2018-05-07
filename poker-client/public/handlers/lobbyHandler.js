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
  this.disconnectFromLobby = this.disconnectFromLobby.bind(this);
}

/**
 * [setLobbyRequestHandler description]
 * @param {Object} ipcMain            [description]
 * @param {Object} lobbySocketGateway [description]
 */
const setLobbyRequestHandler = (ipcMain, lobbySocketGateway) => {
  ipcMain.on('lobby-request', (e) => {
    console.log('Send lobby request');
    lobbySocketGateway.sendLobbyRequestAsync().then((replyMessage) => {
      console.log('Lobby reply received');
      lobbySocketGateway.onLobbyUpdate((err, message) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Lobby reply received');
          e.sender.send('lobby-update', message.data.tableItems);
        }
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
    console.log('Send create table request');
    tableAmqpGateway.sendCreateTableRequestAsync(sessionId, data).then((replyMessage) => {
      console.log('Create table reply received');
      if (replyMessage.type === 'error') {
        console.log(replyMessage.error);
      } else {
        e.sender.send('create-table-reply', {
          sessionId,
          tableId: replyMessage.data.id,
        });
        const result = disconnectFromLobby();
        if (result instanceof Error) {
          console.log(result);
        } else {
          console.log('Disconnected from lobby');
        }
      }
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
    console.log('Send join table request');
    tableAmqpGateway.sendJoinTableRequestAsync(sessionId, data).then((replyMessage) => {
      console.log('Join table reply received');
      if (replyMessage.type === 'error') {
        console.log(replyMessage.error);
      } else {
        e.sender.send('join-table-reply', {
          sessionId,
          tableId: replyMessage.data.id,
        });
        const result = disconnectFromLobby();
        if (result instanceof Error) {
          console.log(result);
        } else {
          console.log('Disconnected from lobby');
        }
      }
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
      this.gatewayProvider.getLobbyGatewayAsync('socket', {
        host: process.env.LOBBY_HOST,
        port: process.env.LOBBY_PORT,
      }).then((lobbySocketGateway) => {
        this.lobbySocketGateway = lobbySocketGateway;
        this.lobbySocketGateway.onConnected(() => {
          this.isConnected = true;
          resolve();
        });
      }).catch((err) => {
        reject(err);
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
    return true;
  }
  return new Error('Already disconnected from lobby');
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

L.createGatewaysAsync = function createGatewaysAsync() {
  return new Promise((resolve, reject) => {
    this.gatewayProvider.getTableGatewayAsync('amqp', {
      host: process.env.RMQ_HOST,
      exchange: process.env.RMQ_EXCHANGE,
    }).then((tableAmqpGateway) => {
      this.tableAmqpGateway = tableAmqpGateway;
      resolve();
    }).catch((err) => {
      reject(err);
    });
  });
};

module.exports = LobbyHandler;
