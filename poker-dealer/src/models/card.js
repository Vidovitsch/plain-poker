const uuidv4 = require('uuid/v4');

function Card(args) {
  // Meta data (static)
  this.id = uuidv4();
  this.timestamp = new Date();
  this.dealer = args.dealer;

  // Card data (static)
  this.value = args.value;
  this.color = args.color;
  this.suit = args.suit;
}

module.exports = {
  createInstance(args) {
    return new Card(args);
  },
};
