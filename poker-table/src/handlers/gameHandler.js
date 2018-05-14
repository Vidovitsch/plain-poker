function GameHandler(gatewayProvider, gameService) {
  this.gatewayProvider = gatewayProvider;
  this.gameService = gameService;
}

const G = GameHandler.prototype;

/**
 * [startHandlers description]
 * @param  {[type]} channelKey [description]
 * @return {[type]}            [description]
 */
G.startHandlers = function startHandlers(channelKey) {
  // TODO:
};

module.exports = GameHandler;
