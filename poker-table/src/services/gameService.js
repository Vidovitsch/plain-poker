const logger = require('./../util/logger');
const GameHandler = require('./../handlers/gameHandler');
const player = require('./../models/player');

/**
 * [GameService description]
 * @param       {Table} table           [description]
 * @param       {Function} removeTableFunc [description]
 * @constructor
 */
function GameService(table, removeTableFunc) {
  this.table = table;
  this.removeTable = removeTableFunc;
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
      if (gameHandler.start(gatewayProvider, this.table.id)) {
        logger.info(`Game table services started successfully => ${this.table.id}`);
      } else {
        logger.warn('Not all game table services have been started correctly');
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
 * @param  {String} sessionId [description]
 * @return {Boolean}           [description]
 * @return {Error}           [description]
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
