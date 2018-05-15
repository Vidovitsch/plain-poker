const uuidv4 = require('uuid/v4');

function Dealer() {
  // Meta data (static)
  this.id = uuidv4();
  this.sendTo = `dealer_${this.id}`;
  this.timestamp = new Date();
  this.deck = [];
}

module.exports = {
  createInstance() {
    return new Dealer();
  },
};
