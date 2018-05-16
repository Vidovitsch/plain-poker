const randomName = require('node-random-name');

function Player(args) {
  this.sessionId = args.sessionId;
  this.name = randomName();
  this.status = 'active';
  this.amount = args.amount;
}

module.exports = {
  createInstance(args) {
    return new Player(args);
  },
};
