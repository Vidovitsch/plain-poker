let instance = null;

function DealerManager() {
  this.dealers = {};
}

const G = DealerManager.prototype;

module.exports = {
  getInstance(gatewayProvider, dealerManager) {
    if (!instance) {
      instance = new DealerManager(gatewayProvider, dealerManager);
    }
    return instance;
  },
};
