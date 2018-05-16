function CardWrapper(args) {
  // Card wrapper data (static)
  this.card = args.card;
  this.dealerId = args.dealerId;
  this.ownerId = args.ownerId;
}

module.exports = {
  createInstance(args) {
    return new CardWrapper(args);
  },
};
