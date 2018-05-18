const randomName = require('node-random-name');

/**
 * [Player description]
 * @param       {Object} args [description]
 * @constructor
 */
function Player(args) {
  this.sessionId = args.sessionId;
  this.name = randomName();
  this.status = 'waiting';
  this.amount = args.amount;
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
