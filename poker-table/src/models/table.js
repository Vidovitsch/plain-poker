const uuidv4 = require('uuid/v4');
const randomName = require('node-random-name');

/**
 * [Table description]
 * @param       {Object} options [description]
 * @constructor
 */
function Table(ownerId, options) {
  // Meta data (static)
  this.id = uuidv4();
  this.location = `table_${this.id}`;
  this.timestamp = new Date();

  // Table data (static)
  this.name = options.name || randomName();
  this.minPlayerNo = options.minPlayerNo || 2;
  this.maxPlayerNo = options.maxPlayerNo || 5;
  this.minBet = options.minBet || 1;
  this.startupAmount = options.startupAmount || 15;

  // Table data (variable)
  this.status = 'waiting';

  // Game data (variable)]
  this.ownerId = ownerId;
  this.gameNo = 0;
  this.roundNo = 0;
  this.turnNo = 0;
  this.dealer = '';
  this.players = [];
  this.bets = {};
  this.smallBlind = '';
  this.bigBlind = '';
  this.communityCards = [];
  this.totalBet = 0;
}

module.exports = {
  /**
   * [createInstance description]
   * @param  {Object} options [description]
   * @return {Table}         [description]
   * @return {Error}         [description]
   */
  createInstance(ownerId, options) {
    if (!ownerId) {
      throw new Error('Invalid argument(s)');
    }
    return new Table(ownerId, options);
  },
};
