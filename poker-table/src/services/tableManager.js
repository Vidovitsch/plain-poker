const Table = require('./../models/table');
const TableItem = require('./../models/tableItem');

function TableManager() {
  this.tables = [];
}

const addPlayer = (table, sessionId) => {
  if (!table.players.includes(sessionId)) {
    table.players.push(sessionId);
    return true;
  }
  return new Error('Player is already added to the table');
};

const removePlayer = (table, sessionId) => {
  const index = table.players.indexOf(sessionId);
  if (index >= -1) {
    // Remove player
    table.players.splice(index, 1);
    // Remove if table is empty
    if (table.players.length === 0) {
      this.tables.splice(this.tables.indexOf(table), 1);
    }
    return true;
  }
  return new Error('Player doesn\'t exist');
};

const T = TableManager.prototype;

T.createTable = function createTable(options, sessionId) {
  const table = new Table(options);
  const addPlayerRes = addPlayer(table, sessionId);
  if (addPlayerRes instanceof Error) {
    return addPlayerRes;
  }
  this.tables.push(table);
  return table;
};

T.joinTable = function joinTable(tableId, sessionId) {
  const table = this.tables.find(t => t.id === tableId);
  if (table) {
    const addPlayerRes = addPlayer(table, sessionId);
    if (addPlayerRes instanceof Error) {
      return addPlayerRes;
    }
    return true;
  }
  return new Error('Table doesn\'t exist');
};

T.leaveTable = function leaveTable(tableId, sessionId) {
  const table = this.tables.find(t => t.id === tableId);
  if (table) {
    const removePlayerRes = removePlayer(table, sessionId);
    if (removePlayerRes instanceof Error) {
      return removePlayerRes;
    }
    return true;
  }
  return new Error('Table doesn\'t exist');
};

T.convertToTableItem = function convertToTableItem(table) {
  if (table instanceof Table) {
    return new TableItem(table);
  }
  return new Error('Argument is not an instance of Table');
};

module.exports = TableManager;
