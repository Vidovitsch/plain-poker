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
  this.tableGameAmqpGateway = null;
}

const G = GameHandler.prototype;

G.startAsync = function startAsync(tableId, tableLocation) {
  return new Promise((resolve, reject) => {
    if (this.checkTableGameAmqpGateway()) {
      this.gatewayProvider.createSharedChannelAsync(this.channelKey, this.connectionKey).then(() => {
        this.startLeaveGameHandler(tableLocation);
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
 * [startLeaveGameHandler description]
 * @param  {IpcMain} ipcMain [description]
 */
G.startLeaveGameHandler = function startLeaveGameHandler(tableLocation) {
  const context = 'leave-game-request';
  this.ipcMain.on(context, (e) => {
    this.tableGameAmqpGateway.sendLeaveGameRequestAsync(this.sessionId, tableLocation).then((replyMessage) => {
      if (replyMessage.hasErrors) {
        logger.error(replyMessage.data);
      }
      e.sender.send('leave-game-reply', replyMessage.data);
      this.stop();
      this.switchHandlers();
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
