const uuidv4 = require('uuid/v4');

/**
 * [Dealer description]
 * @param       {Object} args [description]
 * @constructor
 */
function Dealer(args) {
  // Meta data (static)
  this.id = uuidv4();
  this.location = `dealer_${this.id}`;
  this.timestamp = new Date();

  // Dealer data (static)
  this.tableId = args.tableId;
  this.deck = args.deck;
}

module.exports = {
  /**
   * [createInstance description]
   * @param  {Object} args [description]
   * @return {Dealer}      [description]
   */
  createInstance(args) {
    if (!args.tableId || !args.deck) {
      throw new Error('Invalid argument(s)');
    }
    return new Dealer(args);
  },
};
