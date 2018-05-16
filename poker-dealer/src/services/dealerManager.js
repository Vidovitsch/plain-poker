const Dealer = require('./../models/dealer');
const DeckHelper = require('./../util/deckHelper');
const GameService = require('./gameService');

// singleton support
let instance = null;

/**
 * [DealerManager description]
 * @param       {Object} gatewayProvider [description]
 * @constructor
 */
function DealerManager(gatewayProvider) {
  this.dealers = {};
  this.deckHelper = DeckHelper.getInstance();
  this.gatewayProvider = gatewayProvider;
}

const D = DealerManager.prototype;

/**
 * [createDealerAsync description]
 * @param  {String} tableId [description]
 * @return {Promise}         [description]
 */
D.createDealerAsync = function createDealerAsync(tableId) {
  return new Promise((resolve, reject) => {
    const shuffledDeck = this.deckHelper.shuffleDeck(this.deckHelper.createSortedDeck());
    const dealer = Dealer.createInstance({ tableId, deck: shuffledDeck });
    const gameService = GameService.createInstance(dealer, this.removeDealer);
    gameService.startAsync(this.gatewayProvider).then(() => {
      this.dealers[dealer.id] = gameService;
      resolve(dealer.id);
    }).catch((err) => {
      reject(err);
    });
  });
};

/**
 * [removeDealer description]
 * @param  {String} dealerId [description]
 */
D.removeDealer = function removeDealer(dealerId) {
  delete this.dealers[dealerId];
};

module.exports = {
  /**
   * [createInstance description]
   * @param  {Object} gatewayProvider [description]
   * @return {DealerManager}      [description]
   */
  getInstance(gatewayProvider) {
    if (!instance) {
      if (!gatewayProvider) {
        throw new Error('Invalid argument(s)');
      }
      instance = new DealerManager(gatewayProvider);
    }
    return instance;
  },
};
