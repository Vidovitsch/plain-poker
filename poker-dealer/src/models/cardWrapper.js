function CardWrapper(args) {
  // Card wrapper data (static)
  this.card = args.card;
  this.dealer = args.dealer;
  this.owner = args.owner;
}

module.exports = {
  createInstance(args) {
    return new CardWrapper(args);
  },
};
