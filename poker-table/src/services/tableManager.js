const Table = require('./../models/table');
const TableItem = require('./../models/tableItem');

function TableManager() {
  this.tables = [];
}

const T = TableManager.prototype;

T.createTable = function createTable(sessionId, options) {
  const table = new Table(options);
  this.tables.push(table);
  table.addPlayer(sessionId);
  return table;
};

T.joinTable = function joinTable(sessionId, tableId) {
  const table = this.tables.find(t => t.id === tableId);
  if (table) {
    table.addPlayer(sessionId);
  }
  return table;
};

T.getTableItem = function getTableItem(table) {
  return new TableItem(table);
};

module.exports = TableManager;
