const logger = require('./../util/logger');

// singleton support
let instance = null;

/**
 * [LobbyHandler description]
 * @param       {String} sessionId [description]
 * @constructor
 */
function LobbyHandler(sessionId, enterGameFunc) {
  this.sessionId = sessionId;
  this.isConnected = false;
  this.lobbySocketGateway = null;
  this.tableAmqpGateway = null;
  this.enterGame = enterGameFunc;
  this.disconnectFromLobby = this.disconnectFromLobby.bind(this);
}

const L = LobbyHandler.prototype;

/**
 * [start description]
 * @param  {Object} gatewayProvider [description]
 * @param  {IpcMain} ipcMain         [description]
 * @return {Boolean}                 [description]
 */
L.start = function start(gatewayProvider, ipcMain) {
  if (this.checkTableAmqpGateway(gatewayProvider) &&
      this.checkLobbySocketGateway(gatewayProvider)) {
    this.startLobbyRequestHandler(ipcMain);
    this.startCreateTableHandler(ipcMain);
    this.startJoinTableHandler(ipcMain);
    return true;
  }
  return false;
};

/**
 * [startLobbyRequestHandler description]
 * @param  {IpcMain} ipcMain [description]
 */
L.startLobbyRequestHandler = function startLobbyRequestHandler(ipcMain) {
  ipcMain.on('lobby-request', (e) => {
    logger.info('Send request: lobby-request');
    this.lobbySocketGateway.sendLobbyRequestAsync().then((replyMessage) => {
      logger.info(`Reply received: ${replyMessage.context}`);

      // Initialize listener for future lobby updates
      this.lobbySocketGateway.onLobbyUpdate((err, message) => {
        if (err) {
          logger.error(err);
        } else {
          logger.info(`Lobby update received: ${message.context}`);
          e.sender.send('lobby-update', message.data.tableItems);
        }
      });

      e.sender.send('lobby-reply', replyMessage.data.tableItems);
    }).catch((err) => {
      logger.log(err);
    });
  });
};

/**
 * [startCreateTableHandler description]
 * @param  {IpcMain} ipcMain [description]
 * @return {Boolean}         [description]
 */
L.startCreateTableHandler = function startCreateTableHandler(ipcMain) {
  ipcMain.on('create-table-request', (e, tableOptions) => {
    logger.info('Send request: create-table-request');
    this.tableAmqpGateway.sendCreateTableRequestAsync(this.sessionId, tableOptions).then((replyMessage) => {
      const { data, context, hasErrors } = replyMessage;
      logger.info(`Reply received: ${context}`);
      if (hasErrors) {
        logger.error(data);
      } else {
        e.sender.send('create-table-reply', data);
        const result = this.disconnectFromLobby();
        if (result instanceof Error) {
          logger.error(result);
        } else {
          logger.info('Disconnected from lobby');
          this.enterGame({ tableId: data.id, tableLocation: data.location });
        }
      }
    }).catch((err) => {
      logger.error(err);
    });
  });
};

/**
 * [startJoinTableHandler description]
 * @param  {IpcMain} ipcMain [description]
 * @return {Boolean}         [description]
 */
L.startJoinTableHandler = function startJoinTableHandler(ipcMain) {
  ipcMain.on('join-table-request', (e, data) => {
    logger.info('Request sent: join-table-request');
    this.tableAmqpGateway.sendJoinTableRequestAsync(this.sessionId, data).then((replyMessage) => {
      logger.info(`Reply received: ${replyMessage.context}`);
      if (replyMessage.type === 'error') {
        logger.error(replyMessage.error);
      } else {
        e.sender.send('join-table-reply', replyMessage.data);
        const result = this.disconnectFromLobby();
        if (result instanceof Error) {
          logger.error(result);
        } else {
          logger.log('Disconnected from lobby');
          this.enterGame(data.id);
        }
      }
    }).catch((err) => {
      logger.log(err);
    });
  });
};

/**
 * [connect description]
 * @return {Promise} [description]
 */
L.connectToLobbyAsync = function connectToLobbyAsync() {
  return new Promise((resolve, reject) => {
    if (!this.isConnected) {
      this.lobbySocketGateway.connect();
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
 * @return {Boolean} [description]
 * @return {Error} [description]
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
 * [checkTableAmqpGateway description]
 * @param  {Object} gatewayProvider [description]
 * @return {Boolean}                 [description]
 */
L.checkTableAmqpGateway = function checkTableAmqpGateway(gatewayProvider) {
  if (!this.tableAmqpGateway) {
    const result = gatewayProvider.getTableGateway('amqp');
    if (result instanceof Error) {
      logger.error(result);
      return false;
    }
    this.tableAmqpGateway = result;
  }
  return true;
};

/**
 * [checkTableAmqpGateway description]
 * @param  {Object} gatewayProvider [description]
 * @return {Boolean}                 [description]
 */
L.checkLobbySocketGateway = function checkLobbySocketGateway(gatewayProvider) {
  if (!this.lobbySocketGateway) {
    const result = gatewayProvider.getLobbyGateway('ws');
    if (result instanceof Error) {
      logger.error(result);
      return false;
    }
    this.lobbySocketGateway = result;
  }
  return true;
};

module.exports = {
  /**
   * [getInstance description]
   * @param  {String} sessionId [description]
   * @return {LobbyHandler}           [description]
   */
  getInstance(sessionId, enterGameFunc) {
    if (!instance) {
      if (!sessionId || !enterGameFunc) {
        throw new Error('Invalid argument(s)');
      }
      instance = new LobbyHandler(sessionId, enterGameFunc);
    }
    return instance;
  },
};
