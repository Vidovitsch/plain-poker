function GameHandler(gameService) {
  this.gatewayProvider = gameService.dealerManager.gatewayProvider;
  this.gameService = gameService;
}

const G = GameHandler.prototype;

module.exports = {
  createInstance(gatewayProvider, gameService) {
    return new GameHandler(gatewayProvider, gameService);
  },
};
