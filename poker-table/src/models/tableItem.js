/**
 * [TableItem description]
 * @param       {[type]} table [description]
 * @constructor
 */
function TableItem(table) {
  this.id = table.id;
  this.name = table.name;
  this.playerNo = table.players.length;
  this.status = table.status;
  this.minPlayerNo = table.minPlayerNo;
  this.maxPlayerNo = table.maxPlayerNo;
  this.minBet = table.minBet;
  this.startupAmount = table.startupAmount;
}

module.exports = TableItem;
