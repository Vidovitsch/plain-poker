const uuidv4 = require('uuid/v4');
const randomName = require('node-random-name');

/**
 * [Table description]
 * @param       {[type]} options [description]
 * @constructor
 */
function Table(options) {
  this.id = uuidv4();
  this.sendTo = `table_${this.id}`;
  this.name = options.name || randomName();
  this.timestamp = new Date();
  this.status = 'waiting';
  this.dealer = '';
  this.players = [];
  this.cards = [];
  this.totalBet = 0;
  this.minPlayerNo = options.minPlayerNo || 2;
  this.maxPlayerNo = options.maxPlayerNo || 5;
  this.minBet = options.minBet || 1;
  this.startupAmount = options.startupAmount || 15;
}

module.exports = Table;
