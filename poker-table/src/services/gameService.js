const GameHandler = require('./../handlers/gameHandler');
const player = require('./../models/player');

function GameService(table, tableManager) {
  this.table = table;
  this.tableManager = tableManager;
  this.scoreCalculator = tableManager.scoreCalculator;
  this.rules = tableManager.rules;
  this.gatewayProvider = tableManager.gatewayProvider;
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
  const { players } = this.table;
  const existingPlayer = players.find(p => p.sessionId === sessionId);
  if (!existingPlayer) {
    players.push(player.createInstance({
      sessionId,
      amount: this.table.startupAmount,
    }));
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
  const { players } = this.table;
  const existingPlayer = players.find(p => p.sessionId === sessionId);
  if (existingPlayer) {
    // Remove player
    const index = players.indexOf(existingPlayer);
    players.splice(index, 1);
    // Remove if table is empty
    if (players.length === 0) {
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
