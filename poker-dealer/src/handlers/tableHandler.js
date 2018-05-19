const logger = require('./../util/logger');

// singleton support
let instance = null;

/**
 * [TableHandler description]
 * @param       {DealerManager} dealerManager [description]
 * @constructor
 */
function TableHandler(dealerManager) {
  this.dealerManager = dealerManager;
  this.tableAmqpGateway = null;
}

const G = TableHandler.prototype;

/**
 * [startAllHandlers description]
 * @param  {Object} gatewayProvider [description]
 * @param  {String} channelKey      [description]
 * @return {Boolean}                 [description]
 */
G.start = function start(gatewayProvider, channelKey) {
  if (this.checkTableAmqpGateway(gatewayProvider)) {
    this.startCreateDealerHandler(channelKey);
    return true;
  }
  return false;
};

/**
 * [startCreateDealerHanlder description]
 * @param  {String} channelKey [description]
 */
G.startCreateDealerHandler = function startCreateDealerHanlder(channelKey) {
  this.tableAmqpGateway.onCreateDealerRequest(channelKey, (err, requestMessage) => {
    if (err) {
      logger.error(err);
    } else {
      logger.info(`Request received: ${requestMessage.context} [correlationId:${requestMessage.correlationId}]`);
      // eslint-disable-next-line arrow-body-style
      this.dealerManager.createDealerAsync(requestMessage.data.tableId).then(({ id, location }) => {
        // Send the id of the dealer as a reply to the requester
        logger.info(`Dealer created [id:${id}]`);
        return this.tableAmqpGateway.sendCreateDealerReplyAsync({ id, location }, requestMessage);
      }).then((replyMessage) => {
        logger.info(`Reply sent: ${replyMessage.context} [correlationId:${replyMessage.correlationId}]`);
      }).catch((e) => {
        logger.error(e);
      });
    }
  });
};

/**
 * [checkTableAmqpGateway description]
 * @param  {Object} gatewayProvider [description]
 * @return {Boolean}                 [description]
 */
G.checkTableAmqpGateway = function checkTableAmqpGateway(gatewayProvider) {
  if (!this.tableAmqpGateway) {
    const result = gatewayProvider.getTableGateway('amqp');
    if (result instanceof Error) {
      logger.error(result);
      return false;
    }
    this.tableAmqpGateway = result;
  }
  return true;
};

module.exports = {
  /**
   * [getInstance description]
   * @param  {DealerManager} dealerManager [description]
   * @return {TableHandler}               [description]
   */
  getInstance(dealerManager) {
    if (!instance) {
      if (!dealerManager) {
        throw new Error('Invalid argument(s)');
      }
      instance = new TableHandler(dealerManager);
    }
    return instance;
  },
};
