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
L.handleUpdate = function handleUpdate(action, tableData) {
  const { tableItems } = this.lobby;
  const existingTableItem = tableItems.find(t => t.staticTable.id === tableData.staticTable.id);
  if (existingTableItem) {
    const index = tableItems.indexOf(existingTableItem);
    if (action === 'delete') {
      tableItems.splice(index, 1);
    } else {
      tableItems[index] = tableData;
    }
  } else {
    tableItems.push(tableData);
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
