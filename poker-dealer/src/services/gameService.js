const deckHelper = require('./../util/deckHelper').getInstance();
const gameHandler = require('./../handlers/gameHandler');

function GameService(dealer, dealerManager) {
  this.dealer = dealer;
  this.dealerManager = dealerManager;
  this.gatewayProvider = dealerManager.gatewayProvider;
}

const G = GameService.prototype;

G.startServiceAsync = function startServiceAsync() {
  return new Promise((resolve, reject) => {
    this.gatewayProvider.createSharedChannelAsync(this.dealer.id, 'default').then(() => {
      const newGameHandler = gameHandler.createInstance(this);
      newGameHandler.startAllHandlers(this.dealer.id);
      resolve();
    }).catch((err) => {
      reject(err);
    });
  });
};

G.getCommunityCards = function getCommunityCards(numberOfCards) {
  const cards = deckHelper.getRandomCards(this.dealer.deck, numberOfCards);
  return deckHelper.wrapCards(cards, this.dealer.id, this.dealer.tableId);
};

G.getPlayerCards = function getPlayerCards(numberOfCards, sessions) {
  let wrappedCards = [];
  sessions.forEach((sessionId) => {
    const cards = deckHelper.getRandomCards(this.dealer.deck, numberOfCards);
    const wrapped = deckHelper.wrapCards(cards, this.dealer.id, sessionId);
    wrappedCards = wrappedCards.concat(wrapped);
  });
  return wrappedCards;
};

module.exports = {
  createInstance(dealer, dealerManager) {
    return new GameService(dealer, dealerManager);
  },
};
