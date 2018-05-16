function GameHandler(gameService) {
  this.gatewayProvider = gameService.gatewayProvider;
  this.gameService = gameService;
}

const G = GameHandler.prototype;

G.startAllHandlers = function startAllHandlers(channelKey) {
  // TODO:
};

module.exports = {
  createInstance(gameService) {
    return new GameHandler(gameService);
  },
};
