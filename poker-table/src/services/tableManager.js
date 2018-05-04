const Table = require('./../models/table');
const TableItem = require('./../models/tableItem');

function TableManager() {
  this.tables = [];
}

const addPlayer = (table, sessionId, isOwner) => {
  if (!this.table.players.includes(sessionId)) {
    this.table.players.push(sessionId);
    if (isOwner) {
      this.table.owner = sessionId;
    }
    return true;
  }
  return new Error('Player is already added to the table');
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

T.convertToTableItem = function convertToTableItem(table) {
  if (table instanceof Table) {
    return new TableItem(table);
  }
  return new Error('Argument is not an instance of Table');
};

module.exports = TableManager;
