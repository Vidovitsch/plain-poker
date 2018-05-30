const logger = require('./../util/logger');
const TableItem = require('./../models/tableItem');
const VariableTable = require('./../models/variableTable');

/**
 * [GameHandler description]
 * @param       {GameService} gameService [description]
 * @constructor
 */
function GameHandler(gameService) {
  this.gameService = gameService;
  this.clientGameAmqpGateway = null;
  this.lobbyAmqpGateway = null;
  this.dealerGameAmqpGateway = null;
  this.gatewayProvider = null;
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
      this.checkLobbyAmqpGateway(gatewayProvider) &&
      this.checkDealerGameAmqpGateway(gatewayProvider)) {
    this.gatewayProvider = gatewayProvider;
    this.startLeaveGameHandler(channelKey, gameQueue);
    this.startStartGameHandler(channelKey, gameQueue);
    this.startReadyGameHandler(channelKey, gameQueue);
    this.startCheckHandler(channelKey, gameQueue);
    this.startCallHandler(channelKey, gameQueue);
    this.startBetHandler(channelKey, gameQueue);
    this.startRaiseHandler(channelKey, gameQueue);
    this.startFoldHandler(channelKey, gameQueue);
    return true;
  }
  return false;
};

/**
 * [startLeaveGameHandler description]
 * @param  {String} channelKey [description]
 */
G.startLeaveGameHandler = function startLeaveGameHandler(channelKey, gameQueue) {
  this.clientGameAmqpGateway.onLeaveGameRequestAsync(channelKey, gameQueue, (requestMessage) => {
    const { sessionId } = requestMessage.data;
    const result = this.gameService.removePlayer(sessionId);
    let updateAction = 'update';
    if (result instanceof Error) {
      logger.error(result);
    } else {
      if (result.tableIsEmpty) {
        updateAction = 'delete';
      }
      this.sendLobbyUpdateAsync(updateAction, result.table).then(() => this.clientGameAmqpGateway.sendLeaveGameReplyAsync(result, requestMessage)).then(() => {
        if (result.tableIsEmpty) {
          const { communityCards, dealer: { location: dealerLocation } } = this.gameService.table;
          this.dealerGameAmqpGateway.sendEndGameRequestAsync(communityCards, dealerLocation).then(() => {
            this.stop(channelKey);
          }).catch((ex) => {
            logger.error(ex);
          });
        } else {
          this.sendTableUpdate(result.table);
        }
      }).catch((err) => {
        logger.error(err);
      });
    }
  });
};

/**
 * [startStartGameHandler description]
 * @param  {String} channelKey [description]
 * @param  {String} gameQueue  [description]
 */
G.startStartGameHandler = function startStartGameHandler(channelKey, gameQueue) {
  this.clientGameAmqpGateway.onStartGameRequestAsync(channelKey, gameQueue, (requestMessage) => {
    const result = this.gameService.startGame(requestMessage.data.sessionId);
    if (result instanceof Error) {
      logger.error(result);
    } else {
      // Send a lobby update and a table update if
      // the table started successfully
      const { table } = this.gameService;
      this.sendTableUpdate(table);
      this.sendLobbyUpdateAsync('update', table);
    }
    // This reply will only contain an error or a 'true' value
    this.clientGameAmqpGateway.sendStartGameReplyAsync(result, requestMessage).catch((err) => {
      logger.error(err);
    });
  });
};

/**
 * [startReadyGameHandler description]
 * @param  {String} channelKey [description]
 * @param  {String} gameQueue  [description]
 */
G.startReadyGameHandler = function startReadyGameHandler(channelKey, gameQueue) {
  this.clientGameAmqpGateway.onReadyGameRequestAsync(channelKey, gameQueue, (requestMessage) => {
    const result = this.gameService.setReady(requestMessage.data.sessionId);
    if (result instanceof Error) {
      logger.error(result);
    } else {
      // Start game if everyone at the table has a 'ready' status
      if (this.gameService.checkEveryoneReady()) {
        this.gameService.nextRoundAsync().then(() => {
          this.sendPlayerCards(this.gameService.table);
          this.sendTableUpdate(this.gameService.table);
          this.sendLobbyUpdateAsync('update', this.gameService.table);
        });
      } else {
        this.sendTableUpdate(this.gameService);
        this.sendLobbyUpdateAsync('update', this.gameService);
      }
      // This reply will only contain an error or a 'true' value
      this.clientGameAmqpGateway.sendReadyGameReplyAsync(result, requestMessage).catch((err) => {
        logger.error(err);
      });
    }
  });
};

/**
 * [startCheckHandler description]
 * @param  {String} channelKey [description]
 * @param  {String} gameQueue  [description]
 */
G.startCheckHandler = function startCheckHandler(channelKey, gameQueue) {
  this.clientGameAmqpGateway.onCheckRequestAsync(channelKey, gameQueue, (requestMessage) => {
    // TODO:
  });
};

/**
 * [startCallHandler description]
 * @param  {String} channelKey [description]
 * @param  {String} gameQueue  [description]
 */
G.startCallHandler = function startCallHandler(channelKey, gameQueue) {
  this.clientGameAmqpGateway.onCallRequestAsync(channelKey, gameQueue, (requestMessage) => {
    // TODO:
  });
};

/**
 * [startBetHandler description]
 * @param  {String} channelKey [description]
 * @param  {String} gameQueue  [description]
 */
G.startBetHandler = function startBetHandler(channelKey, gameQueue) {
  this.clientGameAmqpGateway.onBetRequestAsync(channelKey, gameQueue, (requestMessage) => {
    // TODO:
  });
};

/**
 * [startRaiseHandler description]
 * @param  {String} channelKey [description]
 * @param  {String} gameQueue  [description]
 */
G.startRaiseHandler = function startRaiseHandler(channelKey, gameQueue) {
  this.clientGameAmqpGateway.onRaiseRequestAsync(channelKey, gameQueue, (requestMessage) => {
    // TODO:
  });
};

/**
 * [startFoldHandler description]
 * @param  {String} channelKey [description]
 * @param  {String} gameQueue  [description]
 */
G.startFoldHandler = function startFoldHandler(channelKey, gameQueue) {
  this.clientGameAmqpGateway.onFoldRequestAsync(channelKey, gameQueue, (requestMessage) => {
    // TODO:
  });
};

G.getPlayerCardsAsync = function getPlayerCardsAsync(numberOfCards, sessions, dealerLocation) {
  return new Promise((resolve, reject) => {
    this.dealerGameAmqpGateway.sendPlayerCardsRequestAsync(numberOfCards, sessions, dealerLocation).then((replyMessage) => {
      resolve(replyMessage.data.cards);
    }).catch((err) => {
      reject(err);
    });
  });
};

G.sendPlayerCards = function sendPlayerCards(table) {
  Object.keys(table.playerCards).forEach((key) => {
    const cards = table.playerCards[key];
    const { location } = table.players.find(p => p.id === key);
    this.clientGameAmqpGateway.sendPlayerCardsAsync(cards, location);
  });
};

G.sendTableUpdate = function sendTableUpdate(table) {
  const variableTable = VariableTable.createInstance(table);
  logger.info(`Number of players: ${variableTable.players.length}`);
  this.clientGameAmqpGateway.broadcastUpdateAsync(variableTable, table.location);
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

/**
 * [checkLobbyAmqpGateway description]
 * @param  {Object} gatewayProvider [description]
 * @return {Boolean}                 [description]
 */
G.checkDealerGameAmqpGateway = function checkDealerGameAmqpGateway(gatewayProvider) {
  if (!this.dealerGameAmqpGateway) {
    const result = gatewayProvider.getDealerGameGateway('amqp');
    if (result instanceof Error) {
      logger.error(result);
      return false;
    }
    this.dealerGameAmqpGateway = result;
  }
  return true;
};

G.stop = function stop(channelKey) {
  this.gatewayProvider.closeSharedChannel(channelKey);
  this.gameService.stop();
  this.gameService = null;
  this.clientGameAmqpGateway = null;
  this.lobbyAmqpGateway = null;
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
