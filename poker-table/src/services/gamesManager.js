const Table = require('./../models/table');
const TableItem = require('./../models/tableItem');
const GameService = require('./gameService');

function GamesManager(gatewayProvider) {
  this.games = {};
  this.gatewayProvider = gatewayProvider;
}

const G = GamesManager.prototype;

/**
 * [createTable description]
 * @param  {[type]} options   [description]
 * @param  {[type]} sessionId [description]
 * @return {[type]}           [description]
 */
G.createTableAsync = function createTableAsync(options, sessionId) {
  return new Promise((resolve, reject) => {
    // Duplicate table names are not valid
    const existingTable = this.findTableByName(options.name);
    if (existingTable) {
      reject(new Error(`Table name '${existingTable.name}' already exists`));
    }
    // Create new instance of table
    const table = new Table(options);
    const gameService = new GameService(table, this, this.gatewayProvider);

    // Start the gameservice for the specified table and add first player
    gameService.startAsync().then(() => {
      const result = gameService.addPlayer(sessionId);
      if (result instanceof Error) {
        reject(result);
      }
      this.games[table.id] = gameService;
      resolve(table);
    }).catch((err) => {
      reject(err);
    });
  });
};

G.joinTable = function joinTable(tableId, sessionId) {
  const existingTable = this.games[tableId];
  console.log(tableId);
  console.log(this.games);
  console.log(existingTable);
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

G.removeTable = function removeTable(tableId) {
  delete this.tables[tableId];
};

G.findTableByName = function findTableByName(name) {
  let existingTable = null;
  Object.keys(this.games).forEach((key) => {
    const { table } = this.games[key];
    if (table.name === name) {
      existingTable = table;
    }
  });
  return existingTable;
};

G.convertToTableItem = function convertToTableItem(table) {
  if (table instanceof Table) {
    return new TableItem(table);
  }
  return new Error('Argument is not an instance of Table');
};

module.exports = GamesManager;
