const logger = require('./../util/logger');

/**
 * [GameHandler description]
 * @param       {GameService} gameService [description]
 * @constructor
 */
function GameHandler(gameService) {
  this.gameService = gameService;
  this.tableGameAmqpGateway = null;
}

const G = GameHandler.prototype;

/**
 * [start description]
 * @param  {Object} gatewayProvider [description]
 * @param  {String} channelKey      [description]
 * @return {Boolean}                 [description]
 */
G.start = function start(gatewayProvider, channelKey, gameQueue) {
  if (this.checkTableGameAmqpGateway(gatewayProvider)) {
    this.gatewayProvider = gatewayProvider;
    this.startEndGameHandler(channelKey, gameQueue);
    this.startPlayerCardHandler(channelKey, gameQueue);
    this.startCommunityCardHandler(channelKey, gameQueue);
    this.startReturnCardsHandler(channelKey, gameQueue);
    return true;
  }
  return false;
};

G.startPlayerCardHandler = function startPlayerCardHandler(channelKey, gameQueue) {
  this.tableGameAmqpGateway.onPlayerCardsRequest(channelKey, gameQueue, (requestMessage) => {
    const { numberOfCards, sessions } = requestMessage.data;
    const cards = this.gameService.getPlayerCards(numberOfCards, sessions);
    this.tableGameAmqpGateway.sendPlayerCardsReplyAsync({ cards }, requestMessage).catch((err) => {
      logger.error(err);
    });
  });
};

G.startCommunityCardHandler = function startCommunityCardHandler(channelKey, gameQueue) {
  this.tableGameAmqpGateway.onCommunityCardsRequest(channelKey, gameQueue, (requestMessage) => {
    const { numberOfCards } = requestMessage.data;
    const cards = this.gameService.getCommunityCards(numberOfCards);
    this.tableGameAmqpGateway.sendCommunityCardsReplyAsync({ cards }, requestMessage).catch((err) => {
      logger.error(err);
    });
  });
};

G.startEndGameHandler = function startEndGameHandler(channelKey, gameQueue) {
  this.tableGameAmqpGateway.onEndGameRequest(channelKey, gameQueue, (err, requestMessage) => {
    const { communityCards } = requestMessage.data;
    if (communityCards) {
      const result = this.gameService.addCardsToDeck(communityCards);
      if (result instanceof Error) {
        logger.error(result);
      }
    } else if (!this.gameService.checkDeckForCompletion()) {
      logger.error(new Error('Deck is incomplete'));
    }
    this.tableGameAmqpGateway.sendEndGameReplyAsync({}, requestMessage).then(() => {
      this.stop(channelKey);
    }).catch((ex) => {
      logger.error(ex);
    });
  });
};

/**
 * [startReturnCardsHandler description]
 * @param  {String} channelKey [description]
 * @param  {String} gameQueue  [description]
 */
G.startReturnCardsHandler = function startReturnCardsHandler(channelKey, gameQueue) {
  this.tableGameAmqpGateway.onReturnCardsRequestAsync(channelKey, gameQueue, (requestMessage) => {
    const result = this.gameService.returnCards(requestMessage.data.cards);
    this.tableGameAmqpGateway.sendReturnCardsReplyAsync(result, requestMessage).catch((err) => {
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

G.stop = function stop(channelKey) {
  this.gatewayProvider.closeSharedChannel(channelKey);
  this.gameService.stop();
  this.gatewayProvider = null;
  this.tableGameAmqpGateway = null;
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
