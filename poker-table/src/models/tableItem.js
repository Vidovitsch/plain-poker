/**
 * [TableItem description]
 * @param       {[type]} table [description]
 * @constructor
 */
function TableItem(table) {
  this.id = table.id;
  this.sendTo = table.sendTo;
  this.name = table.name;
  this.timestamp = table.timestamp;
  this.status = table.status;
  this.minPlayerNo = table.minPlayerNo;
  this.maxPlayerNo = table.maxPlayerNo;
  this.minBet = table.minBet;
  this.initialAmount = table.initialAmount;
}

module.exports = TableItem;
