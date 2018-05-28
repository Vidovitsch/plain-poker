const randomName = require('node-random-name');

/**
 * [Player description]
 * @param       {Object} args [description]
 * @constructor
 */
function Player(args) {
  const randName = randomName();
  this.id = args.sessionId;
  this.name = randName.substring(0, randName.indexOf(' '));
  this.location = `client_${this.id}`;
  this.status = 'waiting';
  this.amount = args.amount;
  this.isSmallBlind = false;
  this.isBigBlind = false;
}

module.exports = {
  /**
   * [createInstance description]
   * @param  {Object} args [description]
   * @return {Player}      [description]
   * @return {Error}      [description]
   */
  createInstance(args) {
    if (!args.sessionId || !args.amount) {
      throw new Error('Invalid argument(s)');
    }
    return new Player(args);
  },
};
