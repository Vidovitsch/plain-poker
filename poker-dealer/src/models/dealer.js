const uuidv4 = require('uuid/v4');

function Dealer(args) {
  // Meta data (static)
  this.id = uuidv4();
  this.sendTo = `dealer_${this.id}`;
  this.timestamp = new Date();

  // Dealer data (static)
  this.tableId = args.tableId;
  this.deck = args.deck;
}

module.exports = {
  createInstance(args) {
    return new Dealer(args);
  },
};
