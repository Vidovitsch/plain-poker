const logger = require('./../util/logger');

// singleton support
let instance = null;

/**
 * [LobbyHandler description]
 * @param       {String} sessionId [description]
 * @constructor
 */
function LobbyHandler(args) {
  this.sessionId = args.sessionId;
  this.gatewayProvider = args.gatewayProvider;
  this.ipcMain = args.ipcMain;
  this.connectionKey = args.connectionKey;
  this.channelKey = args.channelKey;
  this.switchHandlers = args.switchHanldersFunc;
  this.inGame = false;

  this.lobbySocketGateway = null;
  this.tableAmqpGateway = null;
  this.disconnectFromLobby = this.disconnectFromLobby.bind(this);
  this.startLobbyRequestHandler = this.startLobbyRequestHandler.bind(this);
  this.startCreateTableHandler = this.startCreateTableHandler.bind(this);
}

const L = LobbyHandler.prototype;

/**
 * [start description]
 * @param  {Object} gatewayProvider [description]
 * @param  {IpcMain} ipcMain         [description]
 * @return {Boolean}                 [description]
 */
L.startAsync = function startAsync() {
  return new Promise((resolve, reject) => {
    if (this.checkTableAmqpGateway() && this.checkLobbySocketGateway()) {
      this.gatewayProvider.createSharedChannelAsync(this.channelKey, this.connectionKey).then(() => this.connectToLobbyAsync()).then(() => {
        this.startLobbyRequestHandler();
        this.startCreateTableHandler();
        this.startJoinTableHandler();
        resolve();
      }).catch((err) => {
        reject(err);
      });
    } else {
      reject();
    }
  });
};

/**
 * [startLobbyRequestHandler description]
 * @param  {IpcMain} ipcMain [description]
 */
L.startLobbyRequestHandler = function startLobbyRequestHandler() {
  this.ipcMain.on('lobby-request', (e) => {
    this.lobbySocketGateway.sendLobbyRequestAsync().then((replyMessage) => {
      this.lobbySocketGateway.onLobbyUpdate((err, message) => {
        if (!this.inGame) {
          if (err) {
            logger.error(err);
          } else {
            e.sender.send('lobby-update', message.data.tableItems);
          }
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
L.startCreateTableHandler = function startCreateTableHandler() {
  this.ipcMain.on('create-table-request', (e, tableOptions) => {
    this.tableAmqpGateway.sendCreateTableRequestAsync(this.sessionId, tableOptions).then((replyMessage) => {
      const { data, hasErrors } = replyMessage;
      if (hasErrors) {
        logger.error(data);
      } else {
        e.sender.send('create-table-reply', data);
        const result = this.disconnectFromLobby();
        if (result instanceof Error) {
          logger.error(result);
        } else {
          this.inGame = true;
          this.switchHandlers(data);
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
L.startJoinTableHandler = function startJoinTableHandler() {
  this.ipcMain.on('join-table-request', (e, data) => {
    this.tableAmqpGateway.sendJoinTableRequestAsync(this.sessionId, data).then((replyMessage) => {
      if (replyMessage.type === 'error') {
        logger.error(replyMessage.error);
      } else {
        e.sender.send('join-table-reply', replyMessage.data);
        const result = this.disconnectFromLobby();
        if (result instanceof Error) {
          logger.error(result);
        } else {
          this.inGame = true;
          this.switchHandlers(replyMessage.data);
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
  return new Promise((resolve) => {
    this.lobbySocketGateway.connect();
    this.lobbySocketGateway.onConnected(() => {
      this.isConnected = true;
      resolve();
    });
  });
};

/**
 * [disconnectFromLobby description]
 * @return {Boolean} [description]
 * @return {Error} [description]
 */
L.disconnectFromLobby = function disconnectFromLobby() {
  this.lobbySocketGateway.disconnect();
  this.isConnected = false;
  return true;
};

/**
 * [checkTableAmqpGateway description]
 * @param  {Object} gatewayProvider [description]
 * @return {Boolean}                 [description]
 */
L.checkTableAmqpGateway = function checkTableAmqpGateway() {
  if (!this.tableAmqpGateway) {
    const result = this.gatewayProvider.getTableGateway('amqp');
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
L.checkLobbySocketGateway = function checkLobbySocketGateway() {
  if (!this.lobbySocketGateway) {
    const result = this.gatewayProvider.getLobbyGateway('ws');
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
  getInstance(args) {
    if (!instance) {
      if (!args) {
        throw new Error('Invalid argument(s)');
      }
      instance = new LobbyHandler(args);
    }
    return instance;
  },
};
