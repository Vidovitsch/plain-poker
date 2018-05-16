/**
 * [CardWrapper description]
 * @param       {Object} args [description]
 * @constructor
 */
function CardWrapper(args) {
  // Card wrapper data (static)
  this.card = args.card;
  this.dealerId = args.dealerId;
  this.ownerId = args.ownerId || this.dealerId;
}

module.exports = {
  /**
   * [createInstance description]
   * @param  {Object} args [description]
   * @return {CardWrapper}      [description]
   */
  createInstance(args) {
    if (!args.card || !args.dealerId) {
      throw new Error('Invalid argument(s)');
    }
    return new CardWrapper(args);
  },
};
