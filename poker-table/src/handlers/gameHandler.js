const logger = require('./../util/logger');
const TableItem = require('./../models/tableItem');

/**
 * [GameHandler description]
 * @param       {GameService} gameService [description]
 * @constructor
 */
function GameHandler(gameService) {
  this.gameService = gameService;
  this.clientGameAmqpGateway = null;
  this.lobbyAmqpGateway = null;
}

const G = GameHandler.prototype;

/**
 * [start description]
 * @param  {Object} gatewayProvider [description]
 * @param  {String} channelKey      [description]
 * @return {Boolean}                 [description]
 */
G.start = function start(gatewayProvider, channelKey, gameQueue) {
  if (this.checkClientGameAmqpGateway(gatewayProvider) &&
      this.checkLobbyAmqpGateway(gatewayProvider)) {
    this.startLeaveGameHandler(channelKey, gameQueue, gatewayProvider);
    return true;
  }
  return false;
};

/**
 * [startLeaveGameHandler description]
 * @param  {String} channelKey [description]
 */
G.startLeaveGameHandler = function startLeaveGameHandler(channelKey, gameQueue) {
  this.clientGameAmqpGateway.onLeaveGameRequestAsync(channelKey, gameQueue, (err, requestMessage) => {
    const { sessionId } = requestMessage.data;
    const result = this.gameService.removePlayer(sessionId);
    let updateAction = 'update';
    if (result instanceof Error) {
      logger.error(result);
    } else if (result.tableRemoved) {
      updateAction = 'delete';
    }
    this.sendLobbyUpdateAsync(updateAction, result.table).then(() => {
      this.clientGameAmqpGateway.sendLeaveGameReplyAsync(result, requestMessage);
    }).then(() => {
      this.stop(result.table.id);
    }).catch((ex) => {
      logger.error(ex);
    });
  });
};

/**
 * [sendUpdateToLobby description]
 * @param  {Table} table [description]
 */
G.sendLobbyUpdateAsync = function sendLobbyUpdateAsync(action, table) {
  return new Promise((resolve, reject) => {
    const tableItem = TableItem.createInstance(table);
    this.lobbyAmqpGateway.sendLobbyUpdateAsync(action, tableItem).then(() => {
      resolve();
    }).catch((ex) => {
      reject(ex);
    });
  });
};

/**
 * [checkClientGameAmqpGateway description]
 * @param  {Object} gatewayProvider [description]
 * @return {Boolean}                 [description]
 */
G.checkClientGameAmqpGateway = function checkClientGameAmqpGateway(gatewayProvider) {
  if (!this.clientGameAmqpGateway) {
    const result = gatewayProvider.getClientGameGateway('amqp');
    if (result instanceof Error) {
      logger.error(result);
      return false;
    }
    this.clientGameAmqpGateway = result;
  }
  return true;
};

/**
 * [checkLobbyAmqpGateway description]
 * @param  {Object} gatewayProvider [description]
 * @return {Boolean}                 [description]
 */
G.checkLobbyAmqpGateway = function checkLobbyAmqpGateway(gatewayProvider) {
  if (!this.lobbyAmqpGateway) {
    const result = gatewayProvider.getLobbyGateway('amqp');
    if (result instanceof Error) {
      logger.error(result);
      return false;
    }
    this.lobbyAmqpGateway = result;
  }
  return true;
};

G.stop = function stop(channelKey) {
  this.gatewayProvider.closeSharedChannel(channelKey);
  this.gameService = null;
  this.clientGameAmqpGateway = null;
  this.lobbyAmqpGateway = null;
  this.gameService.stop();
};

module.exports = {
  /**
   * [createInstance description]
   * @param  {GameService} gameService [description]
   * @return {GameHandler}             [description]
   * @return {Error}             [description]
   */
  createInstance(gameService) {
    if (!gameService) {
      throw new Error('Invalid argument(s)');
    }
    return new GameHandler(gameService);
  },
};
