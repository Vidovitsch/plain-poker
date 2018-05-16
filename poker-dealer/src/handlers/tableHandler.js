let instance = null;

function TableHandler(gatewayProvider, dealerManager) {
  this.gatewayProvider = gatewayProvider;
  this.dealerManager = dealerManager;
  this.tableAmqpGateway = gatewayProvider.getTableGateway('amqp');
}

const G = TableHandler.prototype;

G.startAllHandlers = function startAllHandlers(channelKey) {
  this.startCreateDealerHandler(channelKey);
};

G.startCreateDealerHandler = function startCreateDealerHanlder(channelKey) {
  this.tableAmqpGateway.onCreateDealerRequest(channelKey, (err, requestMessage) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Create dealer request received');
      this.dealerManager.createDealerAsync(requestMessage.data.tableId).then((dealerId) => {
        console.log('New dealer created successfully');
        const replyData = {
          dealerId,
        };
        this.tableAmqpGateway.sendCreateDealerReplyAsync(replyData, requestMessage).then(() => {
          console.log('Create dealer reply sent');
        }).catch((ex) => {
          console.log(ex);
        });
      }).catch((ex) => {
        console.log(ex);
      });
    }
  });
};

module.exports = {
  getInstance(gatewayProvider, dealerManager) {
    if (!instance) {
      instance = new TableHandler(gatewayProvider, dealerManager);
    }
    return instance;
  },
};
