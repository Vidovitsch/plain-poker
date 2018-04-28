const uuidv4 = require('uuid/v4');
const randomName = require('node-random-name');

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
    this.name = options.name || randomName();
    this.minPlayerNo = options.minPlayerNo || 2;
    this.maxPlayerNo = options.maxPlayerNo || 9;
    this.minBet = options.minBet || 1;
    this.initialAmount = options.initialAmount || 15;
}

const T = Table.prototype;

T.addPlayer = function(player) {
    if (this.players.length < this.maxPlayerNo && this.players.indexOf(player) < 0) {
        this.players.push(player);
        return true;
    }
    return false;
};

T.removePlayer = function(player) {
    const index = this.players.indexOf(player);
    if (index > -1) {
      this.players.splice(index, 1);
      return true;
    }
    return false;
};

module.exports = Table;
