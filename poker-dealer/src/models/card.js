const uuidv4 = require('uuid/v4');

function Card(args) {
  // Meta data (static)
  this.id = uuidv4();
  this.deckId = args.deckId;
  this.timestamp = new Date();

  // Card data (static)
  this.value = args.value;
  this.suit = args.suit;
}

module.exports = {
  createInstance(args) {
    return new Card(args);
  },
};
