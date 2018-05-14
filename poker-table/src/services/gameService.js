const GameHandler = require('./../handlers/gameHandler');

function GameService(table, gamesManager) {
  this.table = table;
  this.gamesManager = gamesManager;
  this.scoreCalculator = gamesManager.scoreCalculator;
  this.rules = gamesManager.rules;
  this.gatewayProvider = gamesManager.gatewayProvider;
}

const G = GameService.prototype;

/**
 * [startAsync description]
 * @return {[type]} [description]
 */
G.startServiceAsync = function startServiceAsync() {
  return new Promise((resolve, reject) => {
    this.gatewayProvider.createSharedChannelAsync(this.table.id, 'default').then(() => {
      const gameHandler = new GameHandler(this.gatewayProvider, this);
      gameHandler.startHandlers(this.table.id);
      resolve();
    }).catch((err) => {
      reject(err);
    });
  });
};

/**
 * [addPlayer description]
 * @param {[type]} sessionId [description]
 */
G.addPlayer = function addPlayer(sessionId) {
  if (!this.table.players.includes(sessionId)) {
    this.table.players.push(sessionId);
    return true;
  }
  return new Error('Player is already added to the table');
};

/**
 * [removePlayer description]
 * @param  {[type]} sessionId [description]
 * @return {[type]}           [description]
 */
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

G.nextGame = function nextGame() {

};

G.nextRound = function nextRound() {

};

G.nextTurn = function nextTurn() {

};

G.findWinner = function findWinner() {

};

module.exports = GameService;
