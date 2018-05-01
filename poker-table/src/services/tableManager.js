const Table = require('./../models/table');

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

module.exports = TableManager;
