const Lobby = require('./../models/lobby');

function LobbyManager() {
  this.lobby = new Lobby();
}

const L = LobbyManager.prototype;

L.handleUpdate = function handleUpdate(newTableItem) {
  const tableItem = this.lobby.tableItems.find(t => t.id === newTableItem.id);
  if (tableItem) {
    const index = this.lobby.tableItems.indexOf(tableItem);
    this.lobby.tableItems[index] = newTableItem;
  } else {
    this.lobby.tableItems.push(newTableItem);
  }

  return true;
};

module.exports = LobbyManager;
