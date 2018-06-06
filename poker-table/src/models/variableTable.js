/**
 * [TableItem description]
 * @param       {Table} table [description]
 * @constructor
 */
function VariableTable(table) {
  this.status = table.status;
  this.gameRound = table.gameRound;
  this.ownerId = table.ownerId;
  this.players = table.players;
  this.bets = table.bets;
  this.communityCards = table.communityCards;
  this.pot = table.pot;
  this.minRaise = table.minRaise;
  this.showdownResults = table.showdownResults;
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
