let instance = null;

function TableHandler(gatewayProvider, dealerManager) {
  this.gatewayProvider = gatewayProvider;
  this.dealerManager = dealerManager;
  this.clientGameAmqpGateway = gatewayProvider.getClientGameGateway('amqp');
}

const G = TableHandler.prototype;

G.startHandlers = function startHandlers(channelKey) {

};
module.exports = {
  getInstance(gatewayProvider, dealerManager) {
    if (!instance) {
      instance = new TableHandler(gatewayProvider, dealerManager);
    }
    return instance;
  },
};
