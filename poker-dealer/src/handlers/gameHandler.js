let instance = null;

function GameHandler(gatewayProvider, dealerManager) {
  this.gatewayProvider = gatewayProvider;
  this.dealerManager = dealerManager;
  this.clientGameAmqpGateway = gatewayProvider.getClientGameGateway('amqp');
}

const G = GameHandler.prototype;

module.exports = {
  getInstance(gatewayProvider, dealerManager) {
    if (!instance) {
      instance = new GameHandler(gatewayProvider, dealerManager);
    }
    return instance;
  },
};
