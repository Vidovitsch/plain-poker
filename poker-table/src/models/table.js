const uuidv4 = require('uuid/v4');

/**
 * [Table description]
 * @param       {[type]} options [description]
 * @constructor
 */
function Table(options) {
    this.id = uuidv4();
    this.date = new Date();
    this.status = 'waiting';
    this.startDate = {};
    this.players = [];
    this.cards = [];
    this.totalBet = 0;
    this.name = options.name;
    this.minPlayerNo = options.minPlayerNo || 2;
    this.maxPlayerNo = options.maxPlayerNo || 9;
    this.minBet = options.minBet || 1;
    this.initialAmount = options.initialAmount || 15;
}

module.exports = Table;
