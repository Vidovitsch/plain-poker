const logger = require('./../util/logger');
const TableItem = require('./../models/tableItem');
const VariableTable = require('./../models/variableTable');

// singleton support
let instance = null;

/**
 * [LobbyHandler description]
 * @param       {TableManager} tableManager [description]
 * @constructor
 */
function LobbyHandler(tableManager) {
  this.tableManager = tableManager;
  this.clientAmqpGateway = null;
  this.lobbyAmqpGateway = null;
  this.dealerAmqpGateway = null;
}

const L = LobbyHandler.prototype;

/**
 * [start description]
 * @param  {Object} gatewayProvider [description]
 * @param  {String} channelKey      [description]
 * @return {Boolean}                 [description]
 */
L.start = function start(gatewayProvider, channelKey) {
  if (this.checkClientAmqpGateway(gatewayProvider) &&
      this.checkLobbyAmqpGateway(gatewayProvider) &&
      this.checkDealerAmqpGateway(gatewayProvider)) {
    this.startCreateTableHandler(channelKey);
    this.startJoinTableHandler(channelKey);
    return true;
  }
  return false;
};

/**
 * [startCreateTableHandler description]
 * @param  {String} channelKey [description]
 */
L.startCreateTableHandler = function startCreateTableHandler(channelKey) {
  this.clientAmqpGateway.onCreateTableRequest(channelKey, (err, requestMessage) => {
    let newTable = null;
    if (err) {
      logger.error(err);
    } else {
      this.tableManager.createTableAsync(requestMessage.data.options, requestMessage.data.sessionId).then((table) => {
        newTable = table;
        return this.dealerAmqpGateway.sendCreateDealerRequestAsync(table.id);
      }).then((replyMessage) => {
        this.tableManager.setDealer(newTable.id, replyMessage.data);
        const tableItem = TableItem.createInstance(newTable);
        const variableTable = VariableTable.createInstance(newTable);
        this.clientAmqpGateway.sendCreateTableReplyAsync({ tableItem, variableTable }, requestMessage).catch((ex) => {
          logger.error(ex);
        });
        this.sendLobbyUpdate('create', tableItem);
      }).catch((ex) => {
        logger.error(ex);
      });
    }
  });
};

/**
 * [startJointableHandler description]
 * @param  {String} channelKey [description]
 */
L.startJoinTableHandler = function startJointableHandler(channelKey) {
  this.clientAmqpGateway.onJoinTableRequest(channelKey, (err, requestMessage) => {
    if (err) {
      logger.error(err);
    } else {
      const table = this.tableManager.joinTable(requestMessage.data.tableId, requestMessage.data.sessionId);
      if (table instanceof Error) {
        logger.error(table);
      } else {
        const tableItem = TableItem.createInstance(table);
        const variableTable = VariableTable.createInstance(table);
        this.clientAmqpGateway.sendJoinTableReplyAsync({ tableItem, variableTable }, requestMessage).catch((ex) => {
          logger.error(ex);
        });
        this.sendLobbyUpdate('update', tableItem);
      }
    }
  });
};

/**
 * [sendUpdateToLobby description]
 * @param  {Table} table [description]
 */
L.sendLobbyUpdate = function sendLobbyUpdate(action, tableItem) {
  this.lobbyAmqpGateway.sendLobbyUpdateAsync(action, tableItem).catch((ex) => {
    logger.error(ex);
  });
};

/**
 * [checkClientAmqpGateway description]
 * @param  {Object} gatewayProvider [description]
 * @return {Boolean}                 [description]
 */
L.checkClientAmqpGateway = function checkClientAmqpGateway(gatewayProvider) {
  if (!this.clientAmqpGateway) {
    const result = gatewayProvider.getClientGateway('amqp');
    if (result instanceof Error) {
      logger.error(result);
      return false;
    }
    this.clientAmqpGateway = result;
  }
  return true;
};

/**
 * [checkLobbyAmqpGateway description]
 * @param  {Object} gatewayProvider [description]
 * @return {Boolean}                 [description]
 */
L.checkLobbyAmqpGateway = function checkLobbyAmqpGateway(gatewayProvider) {
  if (!this.lobbyAmqpGateway) {
    const result = gatewayProvider.getLobbyGateway('amqp');
    if (result instanceof Error) {
      logger.error(result);
      return false;
    }
    this.lobbyAmqpGateway = result;
  }
  return true;
};

/**
 * [checkDealerAmqpGateway description]
 * @param  {Object} gatewayProvider [description]
 * @return {Boolean}                 [description]
 */
L.checkDealerAmqpGateway = function checkDealerAmqpGateway(gatewayProvider) {
  if (!this.dealerAmqpGateway) {
    const result = gatewayProvider.getDealerGateway('amqp');
    if (result instanceof Error) {
      logger.error(result);
      return false;
    }
    this.dealerAmqpGateway = result;
  }
  return true;
};

module.exports = {
  /**
   * [getInstance description]
   * @param  {TableManager} TableManager [description]
   * @return {LobbyHandler}               [description]
   */
  getInstance(tableManager) {
    if (!instance) {
      if (!tableManager) {
        throw new Error('Invalid argument(s)');
      }
      instance = new LobbyHandler(tableManager);
    }
    return instance;
  },
};
