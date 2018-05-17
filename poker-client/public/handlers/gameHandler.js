// singleton support
let instance = null;

/**
 * [gameHandler description]
 * @return {[type]} [description]
 */
function GameHandler() {
  // // TODO:
}

module.exports = {
  /**
   * [getInstance description]
   * @param  {[type]} lobbyManager [description]
   * @return {[type]}              [description]
   */
  getInstance(lobbyManager) {
    if (!instance) {
      instance = new GameHandler(lobbyManager);
    }
    return instance;
  },
};
