const Table = require('./../models/table');
const TableItem = require('./../models/tableItem');
const GameService = require('./gameService');
const Rules = require('./../util/rules');
const ScoreCalculator = require('./../util/scoreCalculator');

function TableManager(gatewayProvider) {
  // Key value pairs of table id and gameServices
  this.tables = {};
  this.gatewayProvider = gatewayProvider;
  this.rules = new Rules();
  this.scoreCalculator = new ScoreCalculator(this.rules);
}

const T = TableManager.prototype;

/**
 * [createTable description]
 * @param  {[type]} options   [description]
 * @param  {[type]} sessionId [description]
 * @return {[type]}           [description]
 */
T.createTableAsync = function createTableAsync(options, sessionId) {
  return new Promise((resolve, reject) => {
    // Duplicate table names are not valid
    const existingTable = this.findTableByName(options.name);
    if (existingTable) {
      reject(new Error(`Table name '${existingTable.name}' already exists`));
    }
    // Create new instance of table
    const table = new Table(options);
    const gameService = new GameService(table, this);

    // Start the gameservice for the specified table and add first player
    gameService.startServiceAsync().then(() => {
      const result = gameService.addPlayer(sessionId);
      if (result instanceof Error) {
        reject(result);
      }
      this.tables[table.id] = gameService;
      resolve(table);
    }).catch((err) => {
      reject(err);
    });
  });
};

T.joinTable = function joinTable(tableId, sessionId) {
  const existingTable = this.tables[tableId];
  // Table has to exist
  if (!existingTable) {
    return new Error('Table doesn\'t exist');
  }
  const result = existingTable.addPlayer(sessionId);
  if (result instanceof Error) {
    return result;
  }
  return existingTable.table;
};

T.removeTable = function removeTable(tableId) {
  delete this.tables[tableId];
};

T.findTableByName = function findTableByName(name) {
  let existingTable = null;
  Object.keys(this.tables).forEach((key) => {
    const { table } = this.tables[key];
    if (table.name === name) {
      existingTable = table;
    }
  });
  return existingTable;
};

T.setDealer = function setDealer(tableId, dealerId) {
  const existingTable = this.tables[tableId];
  existingTable.table.dealer = dealerId;
  console.log(`DEALER ADDED ${existingTable.table.dealer}`);
};

T.convertToTableItem = function convertToTableItem(table) {
  if (table instanceof Table) {
    return new TableItem(table);
  }
  return new Error('Argument is not an instance of Table');
};

module.exports = TableManager;
