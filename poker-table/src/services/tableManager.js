const Table = require('./../models/table');
const TableItem = require('./../models/tableItem');

function TableManager() {
  this.tables = [];
}

const T = TableManager.prototype;

/**
 * [createTable description]
 * @param  {[type]} options   [description]
 * @param  {[type]} sessionId [description]
 * @return {[type]}           [description]
 */
T.createTable = function createTable(options, sessionId) {
  // Duplicate table names are not valid
  if (options.name) {
    const existingTable = this.tables.find(t => t.name === options.name);
    if (existingTable) {
      return new Error(`Table name '${existingTable.name}' already exists`);
    }
  }
  // Create new instance of table and add first player
  const table = new Table(options);
  const result = this.addPlayer(table, sessionId);
  if (result instanceof Error) {
    return result;
  }
  this.tables.push(table);

  return table;
};

T.joinTable = function joinTable(tableId, sessionId) {
  const existingTable = this.tables.find(t => t.id === tableId);
  // Table has to exist
  if (!existingTable) {
    return new Error('Table doesn\'t exist');
  }
  const result = this.addPlayer(existingTable, sessionId);
  if (result instanceof Error) {
    return result;
  }
  return existingTable;
};

T.leaveTable = function leaveTable(tableId, sessionId) {
  const table = this.tables.find(t => t.id === tableId);
  if (table) {
    const removePlayerRes = this.removePlayer(table, sessionId);
    if (removePlayerRes instanceof Error) {
      return removePlayerRes;
    }
    return true;
  }
  return new Error('Table doesn\'t exist');
};

T.addPlayer = function addPlayer(table, sessionId) {
  if (!table.players.includes(sessionId)) {
    table.players.push(sessionId);
    return true;
  }
  return new Error('Player is already added to the table');
};

T.removePlayer = function removePlayer(table, sessionId) {
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

T.convertToTableItem = function convertToTableItem(table) {
  if (table instanceof Table) {
    return new TableItem(table);
  }
  return new Error('Argument is not an instance of Table');
};

module.exports = TableManager;
