const deckHelper = require('./../util/deckHelper').getInstance();
const gameService = require('./gameService');
const dealer = require('./../models/dealer');

let instance = null;

function DealerManager(gatewayProvider) {
  this.dealers = {};
  this.gatewayProvider = gatewayProvider;
}

const D = DealerManager.prototype;

/**
 * [createDealerAsync description]
 * @return {[type]} [description]
 */
D.createDealerAsync = function createDealerAsync(tableId) {
  return new Promise((resolve, reject) => {
    const shuffledDeck = deckHelper.shuffleDeck(deckHelper.createSortedDeck());
    const newDealer = dealer.createInstance({ tableId, deck: shuffledDeck });
    const newGameService = gameService.createInstance(newDealer, this);
    newGameService.startServiceAsync().then(() => {
      this.dealers[newDealer.id] = newGameService;
      resolve(newDealer.id);
    }).catch((err) => {
      reject(err);
    });
  });
};

module.exports = {
  getInstance(gatewayProvider) {
    if (!instance) {
      instance = new DealerManager(gatewayProvider);
    }
    return instance;
  },
};
