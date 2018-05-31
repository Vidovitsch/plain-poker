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
  this.minBet = options.minBet || 2;
  this.startupAmount = options.startupAmount || 15;
  this.dealer = '';
  this.turnTime = 30;

  // Table data (variable)
  this.status = 'waiting';

  // Game data (variable)
  this.gameRound = '';
  this.ownerId = ownerId;
  this.players = [];
  this.bets = {};
  this.communityCards = [];
  this.pot = 0;
  this.minRaise = this.minBet;

  // Secret data (variable)
  this.playerCards = {};
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
