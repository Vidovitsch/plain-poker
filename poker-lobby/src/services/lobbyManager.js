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
L.handleUpdate = function handleUpdate({ action, tableItem }) {
  const { tableItems } = this.lobby;
  const existingTableItem = tableItems.find(t => t.id === tableItem.id);
  if (existingTableItem) {
    const index = tableItems.indexOf(existingTableItem);
    if (action === 'delete') {
      tableItems.splice(index, 1);
    } else {
      tableItems[index] = tableItem;
    }
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
