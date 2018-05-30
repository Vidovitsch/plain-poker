const logger = require('./../util/logger');
const HandSolver = require('./../util/handSolver');
const GameHandler = require('./../handlers/gameHandler');
const Player = require('./../models/player');

/**
 * [GameService description]
 * @param       {Table} table           [description]
 * @param       {Function} removeTableFunc [description]
 * @constructor
 */
function GameService(table, removeTableFunc) {
  this.table = table;
  this.removeTable = removeTableFunc;
  this.handSolver = HandSolver.getInstance();
  this.gameHandler = null;
}

const G = GameService.prototype;

/**
 * [startAsync description]
 * @param  {Object} gatewayProvider [description]
 */
G.startAsync = function startAsync(gatewayProvider) {
  return new Promise((resolve, reject) => {
    gatewayProvider.createSharedChannelAsync(this.table.id, 'default').then(() => {
      this.gameHandler = GameHandler.createInstance(this);
      if (this.gameHandler.start(gatewayProvider, this.table.id, this.table.location)) {
        logger.info(`(table) Game services started successfully => [table:${this.table.id}]`);
      } else {
        logger.warn('(table) Not all game services have been started correctly');
      }
      resolve();
    }).catch((err) => {
      reject(err);
    });
  });
};

/**
 * @param  {String} sessionId [description]
 * @return {Boolean}           [description]
 * @return {Error}           [description]
 */
G.startGame = function startGame(sessionId) {
  // Validate that the caller is indeed the owner of the table
  if (sessionId !== this.table.ownerId) {
    return new Error('Only a table owner can start a game');
  }
  if (this.table.status === 'waiting') {
    this.table.status = 'starting';
    // The owner gets the 'ready' status automatically
    const tableOwner = this.table.players.find(p => p.id === this.table.ownerId);
    tableOwner.status = 'ready';
    return true;
  }
  return new Error('The table status has to be set on waiting before being able to start');
};

G.setupTableAsync = function setupTableAsync() {
  return new Promise((resolve, reject) => {
    this.setPlayerCardsAsync().then(() => {
      this.table.status = 'in-game';
      this.resetPlayerStatus();
      this.setSmallBlind();
      this.setBigBlind();
      resolve();
    }).catch((err) => {
      reject(err);
    });
  });
};

G.startPreFlopRoundAsync = function startPreFlopRoundAsync() {
  return new Promise((resolve, reject) => {
    this.setupTableAsync().then(() => {
      this.table.gameRound = 'pre-flop';
      this.setSmallBlindBet();
      this.setBigBlindBet();
      this.setInitialTurn();
      resolve();
    }).catch((err) => {
      reject(err);
    });
  });
};

G.startFlopRound = function startFlopRound() {

};

G.startTurnRound = function startTurnRound() {

};

G.startRiverRound = function startRiverRound() {

};

/**
 * [setBet description]
 * @param {String} playerId [description]
 * @param {Number} amount   [description]
 * @return {Boolean}        [description]
 * @return {Error}          [description]
 */
G.setBet = function setBet(playerId, amount) {
  const { minBet, bets, players } = this.table;
  const player = players.find(p => p.id === playerId);
  if (player.amount >= amount && amount >= minBet) {
    const currentBet = bets[playerId];
    bets[playerId] = currentBet ? currentBet + amount : amount;
    player.amount -= amount;
    player.status = player.amount === amount ? 'all-in' : 'bet';
    this.table.minRaise = amount;
    return true;
  }
  return new Error('Invalid bet');
};

/**
 * [setRaise description]
 * @param {String} playerId [description]
 * @param {Number} amount   [description]
 * @return {Boolean}        [description]
 * @return {Error}          [description]
 */
G.setRaise = function setRaise(playerId, amount) {
  const { minRaise, bets, players } = this.table;
  const player = players.find(p => p.id === playerId);
  if (player.amount >= amount && amount >= minRaise) {
    const currentBet = bets[playerId];
    bets[playerId] = currentBet ? currentBet + amount : amount;
    player.amount -= amount;
    player.status = player.amount === amount ? 'all-in' : 'raised';
    this.table.minRaise = amount;
    return true;
  }
  return new Error('Invalid raise');
};

G.setSmallBlind = function setSmallBlind() {
  const { players } = this.table;
  const randomIndex = Math.floor(Math.random() * players.length);
  players[randomIndex].isSmallBlind = true;
  return true;
};

G.setBigBlind = function setBigBlind() {
  const { players } = this.table;
  const smallBlindPlayer = players.find(p => p.isSmallBlind);
  if (smallBlindPlayer) {
    let bigBlindIndex = players.indexOf(smallBlindPlayer) + 1;
    if (bigBlindIndex === players.length) {
      bigBlindIndex = 0;
    }
    players[bigBlindIndex].isBigBlind = true;
    return true;
  }
  return new Error('Can\'t set big blind without a small blind');
};

G.setSmallBlindBet = function setSmallBlindBet() {
  const { players, minBet } = this.table;
  const smallBlindPlayer = players.find(p => p.isSmallBlind);
  if (smallBlindPlayer) {
    this.setBet(smallBlindPlayer.id, Math.ceil(minBet / 2));
    return true;
  }
  return new Error('Can\'t set initial small blind bet without a small blind');
};

G.setBigBlindBet = function setBigBlindBet() {
  const { players, minBet } = this.table;
  const bigBlindPlayer = players.find(p => p.isBigBlind);
  if (bigBlindPlayer) {
    this.setBet(bigBlindPlayer.id, minBet);
    return true;
  }
  return new Error('Can\'t set initial small blind bet without a big blind');
};

G.setInitialTurn = function setInitialTurn() {
  const { players } = this.table;
  const bigBlindPlayer = players.find(p => p.isBigBlind);
  if (bigBlindPlayer) {
    let index = players.indexOf(bigBlindPlayer) + 1;
    if (index === players.length) {
      index = 0;
    }
    players[index].status = 'turn';
    return true;
  }
  return new Error('Can\'t set initial turn without a big blind');
};

G.resetPlayerStatus = function resetPlayerStatus() {
  const { players } = this.table;
  players.forEach((player) => {
    player.status = 'waiting'; // eslint-disable-line no-param-reassign
  });
};

G.setPlayerCardsAsync = function setPlayerCardsAsync() {
  return new Promise((resolve, reject) => {
    const { players, dealer } = this.table;
    const sessions = players.map(player => player.id);
    this.gameHandler.getPlayerCardsAsync(2, sessions, dealer.location).then((cards) => {
      cards.forEach((card) => {
        const playerCards = this.table.playerCards[card.ownerId];
        if (playerCards) {
          playerCards.push(card);
        } else {
          this.table.playerCards[card.ownerId] = [];
          this.table.playerCards[card.ownerId].push(card);
        }
      });
      resolve();
    }).catch((err) => {
      reject(err);
    });
  });
};

/**
 * [setReady description]
 * @param {String} sessionId [description]
 * @return {Boolean}           [description]
 * @return {Error}           [description]
 */
G.setReady = function setReady(sessionId) {
  if (this.table.status === 'starting') {
    const player = this.table.players.find(p => p.id === sessionId);
    if (!player) {
      return new Error('Player doesn\'t exist');
    }
    player.status = 'ready';
    return true;
  }
  return new Error('The table status has to be set on starting before being able to get players ready');
};

/**
 * [checkIfPlayersReady description]
 * @return {Boolean} [description]
 */
G.checkEveryoneReady = function checkEveryoneReady() {
  return this.table.players.every(({ status }) => {
    if (status === 'ready') {
      return true;
    }
    return false;
  });
};

/**
 * [addPlayer description]
 * @param {String} sessionId [description]
 * @return {Boolean}           [description]
 * @return {Error}           [description]
 */
G.addPlayer = function addPlayer(sessionId) {
  const { players } = this.table;
  const existingPlayer = players.find(p => p.sessionId === sessionId);
  if (!existingPlayer) {
    players.push(Player.createInstance({
      sessionId,
      amount: this.table.startupAmount,
    }));
    return true;
  }
  return new Error('Player is already added to the table');
};

/**
 * [removePlayer description]
 * @param  {String} sessionId [description]
 * @return {Boolean}           [description]
 * @return {Error}           [description]
 */
G.removePlayer = function removePlayer(sessionId) {
  const { players, ownerId } = this.table;
  const player = players.find(p => p.id === sessionId);
  if (player) {
    players.splice(players.indexOf(player), 1);
    if (players.length === 0) {
      return {
        tableIsEmpty: true,
        table: this.table,
      };
    } else if (ownerId === sessionId) {
      this.table.ownerId = players[0].id;
    }
    return {
      tableIsEmpty: false,
      table: this.table,
    };
  }
  return new Error('Player doesn\'t exist');
};

/**
 * [findWinner description]
 * @param  {Array} hands [description]
 * @return {Object}       [description]
 */
G.findWinner = function findWinner(hands) {
  let winner = [];
  hands.forEach((hand) => {
    const solved = this.handSolver.solve(hand.concat(this.table.communityCards));
    if (!winner || solved.points > winner.score.points) {
      winner = {
        ownerId: hand.ownerId,
        score: solved,
      };
    }
  });
  return winner;
};

G.stop = function stop() {
  this.removeTable(this.table.id);
  this.table = null;
  this.removeTable = null;
  this.handSolver = null;
};

module.exports = {
  /**
   * [createInstance description]
   * @param  {Table} table           [description]
   * @param  {Function} removeTableFunc [description]
   * @return {GameService}                 [description]
   */
  createInstance(table, removeTableFunc) {
    if (!table || !removeTableFunc) {
      throw new Error('Invalid argument(s)');
    }
    return new GameService(table, removeTableFunc);
  },
};
