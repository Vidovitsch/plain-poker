const logger = require('./../util/logger');
const HandSolver = require('./../util/handSolver');
const GameHandler = require('./../handlers/gameHandler');
const Player = require('./../models/player');

/**
 * [GameService description]
 * @param       {Table} table           [description]
 * @param       {Function} removeTableFunc [description]
 * @constructor
 */
function GameService(table, removeTableFunc) {
  this.table = table;
  this.removeTable = removeTableFunc;
  this.handSolver = HandSolver.getInstance();
}

const G = GameService.prototype;

/**
 * [startAsync description]
 * @param  {Object} gatewayProvider [description]
 */
G.startAsync = function startAsync(gatewayProvider) {
  return new Promise((resolve, reject) => {
    gatewayProvider.createSharedChannelAsync(this.table.id, 'default').then(() => {
      const gameHandler = GameHandler.createInstance(this);
      if (gameHandler.start(gatewayProvider, this.table.id, this.table.location)) {
        logger.info(`(table) Game services started successfully => [table:${this.table.id}]`);
      } else {
        logger.warn('(table) Not all game services have been started correctly');
      }
      resolve();
    }).catch((err) => {
      reject(err);
    });
  });
};

/**
 * [addPlayer description]
 * @param {String} sessionId [description]
 * @return {Boolean}           [description]
 * @return {Error}           [description]
 */
G.addPlayer = function addPlayer(sessionId) {
  const { players } = this.table;
  const existingPlayer = players.find(p => p.sessionId === sessionId);
  if (!existingPlayer) {
    players.push(Player.createInstance({
      sessionId,
      amount: this.table.startupAmount,
    }));
    return true;
  }
  return new Error('Player is already added to the table');
};

/**
 * [removePlayer description]
 * @param  {String} sessionId [description]
 * @return {Boolean}           [description]
 * @return {Error}           [description]
 */
G.removePlayer = function removePlayer(sessionId) {
  const { players, id: tableId } = this.table;
  let { ownerId } = this.table;
  const player = players.find(p => p.id === sessionId);
  if (player) {
    players.splice(players.indexOf(player), 1);
    if (players.length === 0) {
      this.removeTable(tableId);
      return {
        tableRemoved: true,
        table: this.table,
      };
    } else if (ownerId === sessionId) {
      ownerId = players[0].id;
    }
    return {
      tableRemoved: false,
    };
  }
  return new Error('Player doesn\'t exist');
};

/**
 * [findWinner description]
 * @param  {Array} hands [description]
 * @return {Object}       [description]
 */
G.findWinner = function findWinner(hands) {
  let winner = [];
  hands.forEach((hand) => {
    const solved = this.handSolver.solve(hand.concat(this.table.communityCards));
    if (!winner || solved.points > winner.score.points) {
      winner = {
        ownerId: hand.ownerId,
        score: solved,
      };
    }
  });
  return winner;
};

G.stop = function stop() {
  this.table = null;
  this.removeTable = null;
  this.handSolver = null;
};

module.exports = {
  /**
   * [createInstance description]
   * @param  {Table} table           [description]
   * @param  {Function} removeTableFunc [description]
   * @return {GameService}                 [description]
   */
  createInstance(table, removeTableFunc) {
    if (!table || !removeTableFunc) {
      throw new Error('Invalid argument(s)');
    }
    return new GameService(table, removeTableFunc);
  },
};
