const logger = require('./../util/logger');

// singleton support
let instance = null;

/**
 * [ClientHandler description]
 * @param       {LobbyManager} lobbyManager [description]
 * @constructor
 */
function ClientHandler(lobbyManager) {
  this.lobbyManager = lobbyManager;
  this.clientSocketGateway = null;
  this.tableAmqpGateway = null;
}

const C = ClientHandler.prototype;

/**
 * [start description]
 * @param  {Object} gatewayProvider [description]
 * @param  {String} channelKey      [description]
 * @return {Boolean}                 [description]
 */
C.start = function start(gatewayProvider, channelKey) {
  if (this.checkTableAmqpGateway(gatewayProvider) &&
      this.checkClientSocketGateway(gatewayProvider)) {
    this.startLobbyRequestHandler();
    this.startLobbyUpdateHandler(channelKey);
    return true;
  }
  return false;
};

/**
 * [startLobbyUpdateHandler description]
 * @param  {String} channelKey [description]
 */
C.startLobbyUpdateHandler = function startLobbyUpdateHandler(channelKey) {
  this.tableAmqpGateway.onLobbyUpdate(channelKey, (err, message) => {
    logger.info(`Lobby update received: ${message.context} [tableId:${message.data.id}]`);
    this.lobbyManager.handleUpdate(message.data);
    this.clientSocketGateway.broadcastLobbyUpdate(this.lobbyManager.lobby);
    logger.info(`Lobby update broadcasted: ${message.context}`);
  });
};

/**
 * [startLobbyRequestHandler description]
 */
C.startLobbyRequestHandler = function startLobbyRequestHandler() {
  this.clientSocketGateway.onClientConnected((client) => {
    logger.info(`Client connected: ${client.id}`);
    this.clientSocketGateway.onClientDisconnected(client, () => {
      logger.info(`Client diconnected: ${client.id}`);
    });
    this.clientSocketGateway.onLobbyRequest(client, (requestMessage) => {
      logger.info(`Request received: ${requestMessage.context} [correlationId:${requestMessage.correlationId}]`);
      const { lobby } = this.lobbyManager;
      const replyMessage = this.clientSocketGateway.sendLobbyReply(client, lobby, requestMessage);
      logger.info(`Reply sent: ${replyMessage.context} [correlationId:${replyMessage.correlationId}]`);
    });
  });
};

/**
 * [checkTableAmqpGateway description]
 * @param  {Object} gatewayProvider [description]
 * @return {Boolean}                 [description]
 */
C.checkTableAmqpGateway = function checkTableAmqpGateway(gatewayProvider) {
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

/**
 * [checkTableAmqpGateway description]
 * @param  {Object} gatewayProvider [description]
 * @return {Boolean}                 [description]
 */
C.checkClientSocketGateway = function checkClientSocketGateway(gatewayProvider) {
  if (!this.clientSocketGateway) {
    const result = gatewayProvider.getClientGateway('ws');
    if (result instanceof Error) {
      logger.error(result);
      return false;
    }
    this.clientSocketGateway = result;
  }
  return true;
};

module.exports = {
  /**
   * [getInstance description]
   * @param  {LobbyManager} lobbyManager [description]
   * @return {ClientHandler}              [description]
   */
  getInstance(lobbyManager) {
    if (!instance) {
      if (!lobbyManager) {
        throw new Error('Invalid argument(s)');
      }
      instance = new ClientHandler(lobbyManager);
    }
    return instance;
  },
};
