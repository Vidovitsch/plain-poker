/**
 * [TableItem description]
 * @param       {Table} table [description]
 * @constructor
 */
function VariableTable(table) {
  this.status = table.status;
  this.ownerId = table.ownerId;
  this.players = table.players;
  this.bets = table.bets;
  this.smallBlind = table.smallBlind;
  this.bigBlind = table.bigBlind;
  this.communityCards = table.communityCards;
  this.totalBet = table.totalBet;
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
    return new VariableTable(table);
  },
};
