const uuidv4 = require('uuid/v4');
const cardEnums = require('./../util/cardEnums');
/**
 * [Card description]
 * @param       {Object} args [description]
 * @constructor
 */
function Card(args) {
  // Meta data (static)
  this.id = uuidv4();
  this.deckId = args.deckId;
  this.timestamp = new Date();

  // Card data (static)
  this.value = args.value;
  this.suit = args.suit;
  this.numericValue = cardEnums[args.value].numericValue;
  this.points = cardEnums[args.value].points;
}

module.exports = {
  /**
   * [createInstance description]
   * @param  {Object} args [description]
   * @return {Card}      [description]
   */
  createInstance(args) {
    if (!args.deckId || !args.value || !args.suit) {
      throw new Error('Invalid argument(s)');
    }
    return new Card(args);
  },
};
