const DeckHelper = require('./../util/deckHelper');
const GameHandler = require('./../handlers/gameHandler');
const logger = require('./../util/logger');

/**
 * [GameService description]
 * @param       {Dealer} dealer           [description]
 * @param       {Function} removeDealerFunc [description]
 * @constructor
 */
function GameService(dealer, removeDealerFunc) {
  this.dealer = dealer;
  this.removeDealer = removeDealerFunc;
  this.deckHelper = DeckHelper.getInstance();
}

const G = GameService.prototype;

/**
 * [startAsync description]
 * @param  {Object} gatewayProvider [description]
 * @return {Promise}                 [description]
 */
G.startAsync = function startAsync(gatewayProvider) {
  return new Promise((resolve, reject) => {
    gatewayProvider.createSharedChannelAsync(this.dealer.id, 'default').then(() => {
      const gameHandler = GameHandler.createInstance(this);
      if (gameHandler.start(gatewayProvider, this.dealer.id, this.dealer.location)) {
        logger.info(`(dealer) Game services started successfully => [table:${this.dealer.tableId}]`);
      } else {
        logger.warn('(dealer) Not all game services have been started correctly');
      }
      resolve();
    }).catch((err) => {
      reject(err);
    });
  });
};

/**
 * [getCommunityCards description]
 * @param  {Number} numberOfCards [description]
 * @return {Array}               [description]
 */
G.getCommunityCards = function getCommunityCards(numberOfCards) {
  const cards = this.deckHelper.getRandomCards(this.dealer.deck, numberOfCards);
  return this.deckHelper.wrapCards(cards, this.dealer.id, this.dealer.tableId);
};

/**
 * [getPlayerCards description]
 * @param  {Number} numberOfCards [description]
 * @param  {Array} sessions      [description]
 * @return {Array}               [description]
 */
G.getPlayerCards = function getPlayerCards(numberOfCards, sessions) {
  let wrappedCards = [];
  sessions.forEach((sessionId) => {
    const cards = this.deckHelper.getRandomCards(this.dealer.deck, numberOfCards);
    const wrapped = this.deckHelper.wrapCards(cards, this.dealer.id, sessionId);
    wrappedCards = wrappedCards.concat(wrapped);
  });
  return wrappedCards;
};

G.addCardsToDeck = function addCardsToDeck(cards) {
  const { id: dealerId, deck } = this.dealer;
  const result = cards.every(card => card.card && card.dealerId === dealerId && !deck.includes(card.card));
  if (result) {
    return result;
  }
  return new Error('Card is invalid and can\t be added');
};

G.checkDeckForCompletion = function checkDeckForCompletion() {
  return this.dealer.deck.length === 52;
};

/**
 * [returnCards description]
 * @param  {CardWrapper[]} gameCards [description]
 * @return {Boolean}           [description]
 * @return {Error}           [description]
 */
G.returnCards = function returnCards(gameCards) {
  const { deck } = this.dealer;
  gameCards.forEach(({ card }) => {
    deck.push(card);
  });
  return deck.length === 52 ? true : new Error('Not all cards are returned');
};

G.stop = function stop() {
  this.removeDealer(this.dealer.id);
  this.dealer = null;
  this.removeDealer = null;
  this.deckHelper = null;
};

module.exports = {
  /**
   * [createInstance description]
   * @param  {Dealer} dealer           [description]
   * @param  {Function} removeDealerFunc [description]
   * @return {GameService}                  [description]
   */
  createInstance(dealer, removeDealerFunc) {
    if (!dealer || !removeDealerFunc) {
      throw new Error('Invalid argument(s)');
    }
    return new GameService(dealer, removeDealerFunc);
  },
};
