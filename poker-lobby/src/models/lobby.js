// singleton support
let instance = null;

/**
 * [Lobby description]
 * @constructor
 */
function Lobby() {
  this.tableItems = [];
}

module.exports = {
  /**
   * [getInstance description]
   * @return {Lobby} [description]
   */
  getInstance() {
    if (!instance) {
      instance = new Lobby();
    }
    return instance;
  },
};
