function CardWrapper(args) {
  // Card wrapper data (static)
  this.card = args.card;
  this.dealerId = args.dealerId;
  this.ownerId = args.ownerId || this.dealerId;
}

module.exports = {
  createInstance(args) {
    return new CardWrapper(args);
  },
};
