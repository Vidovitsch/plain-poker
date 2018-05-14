const GameHandler = require('./../handlers/gameHandler');

function GameService(table, gamesManager, gatewayProvider) {
  this.table = table;
  this.gamesManager = gamesManager;
  this.gatewayProvider = gatewayProvider;
  this.gameHandler = new GameHandler(gatewayProvider, this);
}


const G = GameService.prototype;

G.startAsync = function startAsync() {
  return new Promise((resolve, reject) => {
    this.gatewayProvider.createSharedChannelAsync(this.table.id, 'default').then(() => {
      this.gameHandler.startHandlers(this.table.id);
      resolve();
    }).catch((err) => {
      reject(err);
    });
  });
};

G.addPlayer = function addPlayer(sessionId) {
  if (!this.table.players.includes(sessionId)) {
    this.table.players.push(sessionId);
    return true;
  }
  return new Error('Player is already added to the table');
};

// TODO:
G.removePlayer = function removePlayer(sessionId) {
  const index = this.table.players.indexOf(sessionId);
  if (index >= -1) {
    // Remove player
    this.table.players.splice(index, 1);
    // Remove if table is empty
    if (this.table.players.length === 0) {
      this.tableManager.removeTable(this.table.id);
    }
    return true;
  }
  return new Error('Player doesn\'t exist');
};

module.exports = GameService;