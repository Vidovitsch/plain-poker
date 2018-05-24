/**
 * [TableItem description]
 * @param       {Table} table [description]
 * @constructor
 */
function TableItem(table) {
  this.id = table.id;
  this.location = table.location;
  this.timestamp = table.timestamp;
  this.turnTime = table.turnTime;
  this.name = table.name;
  this.playerNo = table.players.length;
  this.status = table.status;
  this.minPlayerNo = table.minPlayerNo;
  this.maxPlayerNo = table.maxPlayerNo;
  this.minBet = table.minBet;
  this.startupAmount = table.startupAmount;
}

module.exports = {
  /**
   * [createInstance description]
   * @param  {Table} table [description]
   * @return {TableItem}       [description]
   * @return {Error}       [description]
   */
  createInstance(table) {
    if (!table) {
      throw new Error('Invalid argument(s)');
    }
    return new TableItem(table);
  },
};
