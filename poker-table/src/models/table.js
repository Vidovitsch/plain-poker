const uuidv4 = require('uuid/v4');
const randomName = require('node-random-name');

/**
 * [Table description]
 * @param       {Object} options [description]
 * @constructor
 */
function Table(options) {
  // Meta data (static)
  this.id = uuidv4();
  this.sendTo = `table_${this.id}`;
  this.timestamp = new Date();

  // Table data (static)
  this.name = options.name || randomName();
  this.minPlayerNo = options.minPlayerNo || 2;
  this.maxPlayerNo = options.maxPlayerNo || 5;
  this.minBet = options.minBet || 1;
  this.startupAmount = options.startupAmount || 15;

  // Table data (variable)
  this.status = 'waiting';

  // Game data (variable)
  this.gameNo = 0;
  this.roundNo = 0;
  this.turnNo = 0;
  this.dealer = '';
  this.players = [];
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
   */
  createInstance(options) {
    return new Table(options);
  },
};
