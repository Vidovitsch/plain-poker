const gameHandler = require('./../handlers/gameHandler');
const cardWrapper = require('./../models/cardWrapper');

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
  const communityCards = [];
  const { deck } = this.dealer;
  let counter = 0;
  while (numberOfCards > counter) {
    const randomIndex = Math.floor(Math.random() * deck);
    communityCards.push(cardWrapper.createInstance({
      card: deck[randomIndex],
      dealerId: this.dealer.id,
      ownerId: this.dealer.tableId,
    }));
    deck.splice(randomIndex, 1);
    counter += 1;
  }
  return communityCards;
};

G.getPlayerCards = function getPlayerCards() {

};

module.exports = {
  createInstance(dealer, dealerManager) {
    return new GameService(dealer, dealerManager);
  },
};
