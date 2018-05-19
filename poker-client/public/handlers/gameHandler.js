const logger = require('./../util/logger');

// singleton support
let instance = null;

/**
 * [GameHandler description]
 * @param       {String} sessionId [description]
 * @param       {String} tableId   [description]
 * @constructor
 */
function GameHandler(sessionId, tableId) {
  this.sessionId = sessionId;
  this.tableId = tableId;
  this.tableGameAmqpGateway = null;
}

const G = GameHandler.prototype;

/**
 * [start description]
 * @param  {Object} gatewayProvider [description]
 * @param  {String} channelKey      [description]
 * @return {Boolean}                 [description]
 */
G.start = function start(gatewayProvider, ipcMain, channelKey) {
  if (this.checkTableGameAmqpGateway(gatewayProvider)) {
    // TODO:
    return true;
  }
  return false;
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
  getInstance(sessionId, tableId) {
    if (!instance) {
      if (!sessionId || !tableId) {
        return new Error('Invalid argument(s)');
      }
      instance = new GameHandler(sessionId, tableId);
    }
    return instance;
  },
};
