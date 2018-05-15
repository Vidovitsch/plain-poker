function CardWrapper(args) {
  this.card = args.card;
  this.owner = args.owner;
}

module.exports = {
  createInstance(args) {
    return new CardWrapper(args);
  },
};
