const Lobby = require('./../models/lobby');

// singleton support
let instance = null;

/**
 * [LobbyManager description]
 * @constructor
 */
function LobbyManager() {
  this.lobby = Lobby.getInstance();
}

const L = LobbyManager.prototype;

/**
 * [handleUpdate description]
 * @param  {TableItem} tableItem [description]
 */
L.handleUpdate = function handleUpdate(tableItem) {
  const { tableItems } = this.lobby;
  const existingTableItem = tableItems.find(t => t.id === tableItem.id);
  console.log('existing');
  console.log(tableItem);
  if (existingTableItem) {
    console.log('before');
    console.log(tableItems);
    const index = tableItems.indexOf(existingTableItem);
    tableItems[index] = tableItem;
    console.log('after');
    console.log(tableItems);
  } else {
    tableItems.push(tableItem);
  }
};

module.exports = {
  /**
   * [getInstance description]
   * @return {LobbyManager} [description]
   */
  getInstance() {
    if (!instance) {
      instance = new LobbyManager();
    }
    return instance;
  },
};
