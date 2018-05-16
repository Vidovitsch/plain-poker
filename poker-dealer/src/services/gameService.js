const DeckHelper = require('./../util/deckHelper');
const GameHandler = require('./../handlers/gameHandler');

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
      gameHandler.start(gatewayProvider, this.dealer.id);
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
