const Table = require('./../models/table');
const GameService = require('./gameService');

// singleton support
let instance = null;

/**
 * [TableManager description]
 * @param       {Object} gatewayProvider [description]
 * @constructor
 */
function TableManager(gatewayProvider) {
  // Key value pairs of table id and gameServices
  this.tables = {};
  this.gatewayProvider = gatewayProvider;
}

const T = TableManager.prototype;

/**
 * [createTableAsync description]
 * @param  {Object} options   [description]
 * @param  {String} sessionId [description]
 * @return {Promise}           [description]
 */
T.createTableAsync = function createTableAsync(options, sessionId) {
  return new Promise((resolve, reject) => {
    // Duplicate table names are not valid
    const existingTable = this.findTableByName(options.name);
    if (existingTable) {
      reject(new Error(`Table name '${existingTable.name}' already exists`));
    }
    // Create new instance of table
    const table = Table.createInstance(options);
    const gameService = GameService.createInstance(table, this.removeTable);

    // Start the gameservice for the specified table and add first player
    gameService.startAsync(this.gatewayProvider).then(() => {
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

/**
 * [joinTable description]
 * @param  {String} tableId   [description]
 * @param  {String} sessionId [description]
 * @return {Table}           [description]
 * @return {Error}           [description]
 */
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

/**
 * [removeTable description]
 * @param  {String} tableId [description]
 */
T.removeTable = function removeTable(tableId) {
  delete this.tables[tableId];
};

/**
 * [findTableByName description]
 * @param  {String} name [description]
 * @return {Table}      [description]
 */
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

/**
 * [setDealer description]
 * @param {String} tableId  [description]
 * @param {String} dealerId [description]
 */
T.setDealer = function setDealer(tableId, dealerId) {
  const existingTable = this.tables[tableId];
  existingTable.table.dealer = dealerId;
};

module.exports = {
  /**
   * [getInstance description]
   * @param  {Object} gatewayProvider [description]
   * @return {TableManager}                 [description]
   */
  getInstance(gatewayProvider) {
    if (!instance) {
      if (!gatewayProvider) {
        throw new Error('Invalid argument(s)');
      }
      instance = new TableManager(gatewayProvider);
    }
    return instance;
  },
};
