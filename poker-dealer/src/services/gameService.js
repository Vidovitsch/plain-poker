const gameHandler = require('./../handlers/gameHandler');

function GameService(dealer, dealerManager) {
  this.dealer = dealer;
  this.dealerManager = dealerManager;
}

const G = GameService.prototype;

G.startServiceAsync = function startServiceAsync() {
  return new Promise((resolve, reject) => {
    this.gatewayProvider.createSharedChannelAsync(this.dealer.id, 'default').then(() => {
      const newGameHandler = gameHandler.createInstance(this);
      newGameHandler.startHandlers(this.dealer.id);
      resolve();
    }).catch((err) => {
      reject(err);
    });
  });
};

module.exports = {
  createInstance(dealer, dealerManager) {
    return new GameService(dealer, dealerManager);
  },
};
