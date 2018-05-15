const cardEnumerations = require('./../util/cardEnumerations');
const gameService = require('./gameService');
const card = require('./../models/card');
const cardWrapper = require('./../models/cardWrapper');
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
    const shuffledDeck = this.shuffleDeck(this.createSortedDeck());
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

D.createSortedDeck = function createSortedDeck() {
  const deck = [];
  cardEnumerations.suits.forEach((suit) => {
    cardEnumerations.values.forEach((value) => {
      deck.push(card.createInstance({
        value,
        suit,
      }));
    });
  });
  return deck;
};

D.shuffleDeck = function shuffleDeck(deck) {
  let counter = deck.length;
  while (counter > 0) {
    const randomIndex = Math.floor(Math.random() * counter);
    counter -= 1;
    this.swapEntries(deck, counter, randomIndex);
  }
  return deck;
};

D.swapEntries = function swapEnties(array, firstIndex, secondIndex) {
  const temp = array[firstIndex];
  /* eslint-disable no-param-reassign */
  array[firstIndex] = array[secondIndex];
  array[secondIndex] = temp;
  /* eslint-enable no-param-reassign */
};

module.exports = {
  getInstance(gatewayProvider, dealerManager) {
    if (!instance) {
      instance = new DealerManager(gatewayProvider, dealerManager);
    }
    return instance;
  },
};
