const logger = require('./../util/logger');

// singleton support
let instance = null;

/**
 * [GameHandler description]
 * @param       {String} sessionId [description]
 * @param       {String} tableId   [description]
 * @constructor
 */
function GameHandler(args) {
  this.sessionId = args.sessionId;
  this.gatewayProvider = args.gatewayProvider;
  this.ipcMain = args.ipcMain;
  this.connectionKey = args.connectionKey;
  this.channelKey = args.channelKey;
  this.switchHandlers = args.switchHanldersFunc;
  this.isStarted = false;
  this.tableGameAmqpGateway = null;
}

const G = GameHandler.prototype;

G.startAsync = function startAsync() {
  return new Promise((resolve, reject) => {
    if (this.checkTableGameAmqpGateway()) {
      this.gatewayProvider.createSharedChannelAsync(this.channelKey, this.connectionKey).then(() => {
        if (!this.isStarted) {
          this.startLeaveGameHandler();
          this.startEnterGameHandler();
          this.startStartGameHandler();
          this.isStarted = true;
        }
        resolve();
      }).catch((err) => {
        reject(err);
      });
    } else {
      reject();
    }
  });
};

G.startEnterGameHandler = function startEnterGameHandler() {
  this.ipcMain.on('game-entered', (e, tableLocation) => {
    this.tableGameAmqpGateway.onUpdate(this.channelKey, `client_${this.sessionId}`, tableLocation, (err, message) => {
      e.sender.send('table-update', message.data);
    });
  });
};

/**
 * [startLeaveGameHandler description]
 * @param  {IpcMain} ipcMain [description]
 */
G.startLeaveGameHandler = function startLeaveGameHandler() {
  const context = 'leave-request';
  this.ipcMain.on(context, (e, tableLocation) => {
    this.tableGameAmqpGateway.sendLeaveGameRequestAsync(this.sessionId, tableLocation).then((replyMessage) => {
      if (replyMessage.hasErrors) {
        logger.error(replyMessage.data);
      }
      e.sender.send('leave-reply', replyMessage.data);
      this.stop();
      this.switchHandlers();
    }).catch((err) => {
      logger.error(err);
    });
  });
};

/**
 * [startStartGameHandler description]
 */
G.startStartGameHandler = function startStartGameHandler() {
  this.ipcMain.on('start-game-request', (e, tableLocation) => {
    this.tableGameAmqpGateway.sendStartGameRequestAsync(this.sessionId, tableLocation).then((replyMessage) => {
      if (replyMessage.hasErrors) {
        logger.error(replyMessage.data);
      }
    }).catch((err) => {
      logger.error(err);
    });
  });
};

/**
 * [checkTableGameAmqpGateway description]
 * @param  {Object} gatewayProvider [description]
 * @return {Boolean}                 [description]
 */
G.checkTableGameAmqpGateway = function checkTableGameAmqpGateway() {
  if (!this.tableGameAmqpGateway) {
    const result = this.gatewayProvider.getTableGameGateway('amqp');
    if (result instanceof Error) {
      logger.error(result);
      return false;
    }
    this.tableGameAmqpGateway = result;
  }
  return true;
};

G.stop = function stop() {
  logger.error(`CHANNELKEY STOP ${this.channelKey}`);
  this.gatewayProvider.closeSharedChannel(this.channelKey);
};

module.exports = {
  /**
   * [getInstance description]
   * @param  {String} sessionId [description]
   * @param  {String} tableId   [description]
   * @return {GameHandler}           [description]
   * @return {Error}           [description]
   */
  getInstance(args) {
    if (!instance) {
      if (!args) {
        return new Error('Invalid argument(s)');
      }
      instance = new GameHandler(args);
    }
    return instance;
  },
};
