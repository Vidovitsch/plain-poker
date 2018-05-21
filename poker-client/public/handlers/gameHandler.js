const logger = require('./../util/logger');

// singleton support
let instance = null;

/**
 * [GameHandler description]
 * @param       {String} sessionId [description]
 * @param       {String} tableId   [description]
 * @constructor
 */
function GameHandler(sessionId, tableId, tableLocation) {
  this.sessionId = sessionId;
  this.tableId = tableId;
  this.tableLocation = tableLocation;
  this.tableGameAmqpGateway = null;
}

const G = GameHandler.prototype;

/**
 * [start description]
 * @param  {Object} gatewayProvider [description]
 * @param  {IpcMain} ipcMain         [description]
 * @param  {String} channelKey      [description]
 * @return {Boolean}                 [description]
 */
G.start = function start(gatewayProvider, ipcMain, channelKey) {
  if (this.checkTableGameAmqpGateway(gatewayProvider)) {
    this.startLeaveGameHandler(ipcMain);
    return true;
  }
  return false;
};

/**
 * [startLeaveGameHandler description]
 * @param  {IpcMain} ipcMain [description]
 */
G.startLeaveGameHandler = function startLeaveGameHandler(ipcMain) {
  const context = 'leave-game-request';
  ipcMain.on(context, (e, data) => {
    this.tableGameAmqpGateway.sendLeaveGameRequestAsync(this.sessionId, this.tableLocation).then((replyMessage) => {
      if (replyMessage.hasErrors) {
        logger.error(replyMessage.data);
      }
      e.sender.send('leave-game-reply', replyMessage.data);
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
G.checkTableGameAmqpGateway = function checkTableGameAmqpGateway(gatewayProvider) {
  if (!this.tableGameAmqpGateway) {
    const result = gatewayProvider.getTableGameGateway('amqp');
    if (result instanceof Error) {
      logger.error(result);
      return false;
    }
    this.tableGameAmqpGateway = result;
  }
  return true;
};

module.exports = {
  /**
   * [getInstance description]
   * @param  {String} sessionId [description]
   * @param  {String} tableId   [description]
   * @return {GameHandler}           [description]
   * @return {Error}           [description]
   */
  getInstance(sessionId, tableId, tableLocation) {
    if (!instance) {
      if (!sessionId || !tableId || !tableLocation) {
        return new Error('Invalid argument(s)');
      }
      instance = new GameHandler(sessionId, tableId, tableLocation);
    }
    return instance;
  },
};
