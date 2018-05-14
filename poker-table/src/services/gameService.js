const GameHandler = require('./../handlers/gameHandler');

function GameService(table, gamesManager, gatewayProvider) {
  this.table = table;
  this.gamesManager = gamesManager;
  this.gatewayProvider = gatewayProvider;
  this.gameHandler = new GameHandler(gatewayProvider, this);
}


const G = GameService.prototype;

G.startAsync = function startAsync() {
  return new Promise((resovle, reject) => {
    this.gatewayProvider.createSharedChannelAsync(this.table.id, 'default').then(() => {
      this.gameHandler.startHandlers(this.table.id);
    }).catch((err) => {
      reject(err);
    });
  });
};

G.addPlayer = function addPlayer(sessionId) {
  if (!this.table.players.includes(sessionId)) {
    this.players.push(sessionId);
    return true;
  }
  return new Error('Player is already added to the table');
};

G.removePlayer = function removePlayer(table, sessionId) {
  const index = table.players.indexOf(sessionId);
  if (index >= -1) {
    // Remove player
    table.players.splice(index, 1);
    // Remove if table is empty
    if (table.players.length === 0) {
      this.tables.splice(this.tables.indexOf(table), 1);
    }
    return true;
  }
  return new Error('Player doesn\'t exist');
};

module.exports = GameService;
