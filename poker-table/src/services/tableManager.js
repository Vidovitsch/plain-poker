const Table = require('./../models/table');
const TableItem = require('./../models/tableItem');

function TableManager() {
  this.tables = [];
}

const T = TableManager.prototype;

T.createTable = function createTable(clientQueue, options) {
  const table = new Table(options);
  this.tables.push(table);
  table.addPlayer(clientQueue);
  return table;
};

T.getTableItem = function getTableItem(table) {
  return new TableItem(table);
};

module.exports = TableManager;
