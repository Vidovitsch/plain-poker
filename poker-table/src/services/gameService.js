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

/**
 * [setupTableAsync description]
 * @return {Promise} [description]
 */
G.setupTableAsync = function setupTableAsync() {
  return new Promise((resolve, reject) => {
    this.setPlayerCardsAsync().then(() => {
      this.table.status = 'in-game';
      this.setSmallBlind();
      this.setBigBlind();
      resolve();
    }).catch((err) => {
      reject(err);
    });
  });
};

/**
 * [checkRoundFinished description]
 * @return {Boolean} [description]
 */
G.checkRoundFinished = function checkRoundFinished() {
  const currentPlayer = this.table.players.find(p => p.hasTurn);
  const nextPlayer = this.getNextPlayer(currentPlayer);
  // The next player must have had a turn is this round.
  // The current player has to either checked, called or folded his turn.
  // Both results concludes that every player has the same bet on the table.
  return nextPlayer.status !== 'waiting' &&
    (currentPlayer.status === 'checked' || currentPlayer.status === 'called' || currentPlayer.status === 'folded');
};

/**
 * [nextRoundAsync description]
 * @return {Promise} [description]
 */
G.nextRoundAsync = function nextRoundAsync() {
  return new Promise((resolve, reject) => {
    let nextRoundPromise = {};
    switch (this.table.gameRound) {
      case 'pre-flop':
        this.addBetsToPot();
        nextRoundPromise = this.startFlopRound();
        break;
      case 'flop':
        this.addBetsToPot();
        nextRoundPromise = this.startTurnRound();
        break;
      case 'turn':
        this.addBetsToPot();
        nextRoundPromise = this.startRiverRound();
        break;
      case 'river':
        this.addBetsToPot();
        nextRoundPromise = this.startShowdownRound();
        break;
      default:
        nextRoundPromise = this.startPreFlopRoundAsync();
    }
    nextRoundPromise.then(() => {
      resolve(true);
    }).call((err) => {
      reject(err);
    });
  });
};

/**
 * [startPreFlopRoundAsync description]
 * @return {Promise} [description]
 */
G.startPreFlopRoundAsync = function startPreFlopRoundAsync() {
  return new Promise((resolve, reject) => {
    this.resetRound();
    this.setupTableAsync().then(() => {
      this.table.gameRound = 'pre-flop';
      this.setSmallBlindBet();
      this.setBigBlindBet();
      this.setInitialTurn();
      resolve(true);
    }).catch((err) => {
      reject(err);
    });
  });
};

G.startFlopRoundAsync = function startFlopRoundAsync() {
  return new Promise((resolve) => {
    this.resetRound();
    resolve();
  });
};

G.startTurnRound = function startTurnRound() {
  return new Promise((resolve) => {
    this.resetRound();
    resolve();
  });
};

G.startRiverRound = function startRiverRound() {
  return new Promise((resolve) => {
    this.resetRound();
    resolve();
  });
};

G.startShowdownRound = function startShowdownRound() {
  return new Promise((resolve) => {
    this.resetRound();
    resolve();
  });
};

/**
 * @return {Boolean} [description]
 */
G.nextTurn = function nextTurn() {
  const currentPlayer = this.table.players.find(p => p.hasTurn);
  const nextPlayer = this.getNextPlayer(currentPlayer);
  currentPlayer.hasTurn = false;
  nextPlayer.hasTurn = true;
  nextPlayer.status = 'turn';
  return true;
};

/**
 * [setCheck description]
 * @param {String} playerId [description]
 * @return {Boolean}        [description]
 * @return {Error}          [description]
 */
G.setCheck = function setCheck(playerId) {
  const player = this.findPlayer(playerId);
  if (player instanceof Error) {
    return player;
  }
  if (this.canCheck(player)) {
    player.status = 'checked';
    return true;
  }
  return new Error('Player can\'t check');
};

/**
 * [setCall description]
 * @param {String} playerId [description]
 * @return {Boolean}        [description]
 * @return {Error}          [description]
 */
G.setCall = function setCall(playerId) {
  const player = this.findPlayer(playerId);
  if (player instanceof Error) {
    return player;
  }
  if (this.canCall(player)) {
    const previousPlayer = this.getPreviousPlayer(player);
    const betPreviousPlayer = this.findCurrentBet(previousPlayer);
    const betCurrentPlayer = this.findCurrentBet(player);
    const betDifference = betPreviousPlayer - betCurrentPlayer;
    this.addToTotalBet(player, betDifference);
    player.status = 'called';
    return true;
  }
  return new Error('Player can\'t call');
};

/**
 * [setBet description]
 * @param {String} playerId [description]
 * @param {Number} amount   [description]
 * @return {Boolean}        [description]
 * @return {Error}          [description]
 */
G.setBet = function setBet(playerId, amount) {
  const player = this.findPlayer(playerId);
  if (player instanceof Error) {
    return player;
  }
  if (this.canBet(player, amount)) {
    this.addToTotalBet(player, amount);
    this.table.minRaise = amount;
    player.hasBet = true;
    player.status = player.amount === 0 ? 'all-in' : 'bet';
    return true;
  }
  return new Error('Player can\'t bet');
};

/**
 * [setRaise description]
 * @param {String} playerId [description]
 * @param {Number} amount   [description]
 * @return {Boolean}        [description]
 * @return {Error}          [description]
 */
G.setRaise = function setRaise(playerId, amount) {
  const player = this.findPlayer(playerId);
  if (player instanceof Error) {
    return player;
  }
  if (this.canRaise(player, amount)) {
    this.addToTotalBet(player, amount);
    this.table.minRaise = amount;
    player.hasRaised = true;
    player.status = player.amount === 0 ? 'all-in' : 'raised';
    return true;
  }
  return new Error('Player can\'t raise');
};

/**
 * [setFold description]
 * @param {String} playerId [description]
 */
G.setFold = function setFold(playerId) {
  const player = this.findPlayer(playerId);
  if (player instanceof Error) {
    return player;
  }
  if (this.canFold(player)) {
    player.status = 'folded';
    return true;
  }
  return new Error('Player can\'t fold');
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

/**
 * [setSmallBlindBet description]
 * @return {Boolean}        [description]
 * @return {Error}          [description]
 */
G.setSmallBlindBet = function setSmallBlindBet() {
  const { players, minBet } = this.table;
  const smallBlindPlayer = players.find(p => p.isSmallBlind);
  if (smallBlindPlayer) {
    return this.setBet(smallBlindPlayer.id, Math.ceil(minBet / 2));
  }
  return new Error('Can\'t set initial small blind bet without a small blind');
};

/**
 * [setBigBlindBet description]
 * @return {Boolean}        [description]
 * @return {Error}          [description]
 */
G.setBigBlindBet = function setBigBlindBet() {
  const { players, minBet } = this.table;
  const bigBlindPlayer = players.find(p => p.isBigBlind);
  if (bigBlindPlayer) {
    return this.setBet(bigBlindPlayer.id, minBet);
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
    const currentPlayer = players[index];
    currentPlayer.status = 'turn';
    currentPlayer.hasTurn = true;
    return true;
  }
  return new Error('Can\'t set initial turn without a big blind');
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

/**
 * [canCheck description]
 * @param  {Player} player [description]
 * @return {Boolean}        [description]
 */
G.canCheck = function canCheck(player) {
  const previousPlayer = this.getPreviousPlayer(player);
  const betPreviousPlayer = this.findCurrentBet(previousPlayer);
  const betCurrentPlayer = this.findCurrentBet(player);
  return player.status === 'turn' && betPreviousPlayer === betCurrentPlayer;
};

/**
 * [canCall description]
 * @param  {Player} player [description]
 * @return {Boolean}        [description]
 */
G.canCall = function canCall(player) {
  const previousPlayer = this.getPreviousPlayer(player);
  const betPreviousPlayer = this.findCurrentBet(previousPlayer);
  const betCurrentPlayer = this.findCurrentBet(player);
  return player.status === 'turn' && betPreviousPlayer > betCurrentPlayer;
};

/**
 * [canBet description]
 * @param  {Player} player [description]
 * @param  {Number} amount [description]
 * @return {Boolean}        [description]
 */
G.canBet = function canBet(player, amount) {
  const { players, minBet } = this.table;
  const hasBets = players.some(p => p.hasBet);
  return player.status === 'turn' && !hasBets && amount >= minBet;
};

/**
 * [canRaise description]
 * @param  {Player} player [description]
 * @param  {Number} amount [description]
 * @return {Boolean}        [description]
 */
G.canRaise = function canRaise(player, amount) {
  const { players, minRaise } = this.table;
  const hasBets = players.some(p => p.hasBet);
  return player.status === 'turn' && !player.hasRaised && !player.hasBet && hasBets && amount >= minRaise;
};

/**
 * [canFold description]
 * @param  {Player} player [description]
 * @return {Boolean}        [description]
 */
G.canFold = function canFold(player) {
  return player.status === ' turn';
};

/**
 * [getNextPlayer description]
 * @param  {Player} currentPlayer [description]
 * @return {Player}               [description]
 */
G.getNextPlayer = function getNextPlayer(currentPlayer) {
  const { players } = this.table;
  let nextIndex = players.indexOf(currentPlayer) + 1;
  if (nextIndex === players.length) {
    nextIndex = 0;
  }
  const nextPlayer = players[nextIndex];
  if (nextPlayer.status === 'folded') {
    return this.getNextPlayer(nextPlayer);
  }
  return nextPlayer;
};

/**
 * [getPreviousPlayer description]
 * @param  {Player} currentPlayer [description]
 * @return {Player}               [description]
 */
G.getPreviousPlayer = function getPreviousPlayer(currentPlayer) {
  const { players } = this.table;
  let previousIndex = players.indexOf(currentPlayer) - 1;
  if (previousIndex === -1) {
    previousIndex = players.length - 1;
  }
  return players[previousIndex];
};

/**
 * [addToCurrentBet description]
 * @param {Player} player [description]
 * @param {Number} amount [description]
 */
G.addToTotalBet = function addToTotalBet(player, amount) {
  const currentBet = this.findCurrentBet(player);
  this.table.bets[player.id] = currentBet ? currentBet + amount : amount;
  player.amount -= amount; // eslint-disable-line no-param-reassign
  return true;
};

/**
 * [addBetsToPot description]
 * @param {Number} amount [description]
 */
G.addBetsToPot = function addBetsToPot() {
  Object.values(this.table.bets).forEach((value) => {
    this.table.pot += value;
  });
  return true;
};

/**
 * [findCurrentBet description]
 * @param  {Player} player [description]
 * @return {Number}        [description]
 */
G.findCurrentBet = function findCurrentBet(player) {
  const currentBet = this.table.bets[player.id];
  return currentBet || 0;
};

/**
 * [findPlayer description]
 * @param  {String} playerId [description]
 * @return {Player}          [description]
 * @return {Error}          [description]
 */
G.findPlayer = function findPlayer(playerId) {
  const player = this.table.players.find(p => p.id === playerId);
  return player || new Error(`Player not found with id ${playerId}`);
};

/**
 * [resetRound description]
 * @return {Boolean} [description]
 */
G.resetRound = function resetRound() {
  this.resetPlayerStatus(false);
  this.table.bets = {};
  return true;
};

/**
 * [resetPlayerStatus description]
 * @param {Boolean} includeFolded [description]
 * @return {Boolean}              [description]
 */
G.resetPlayerStatus = function resetPlayerStatus(includeFolded) {
  const { players } = this.table;
  players.forEach((player) => {
    if (includeFolded || player.status !== 'folded') {
      player.status = 'waiting'; // eslint-disable-line no-param-reassign
    }
  });
  return true;
};

/**
 * [stop description]
 * @return {Boolean} [description]
 */
G.stop = function stop() {
  this.removeTable(this.table.id);
  this.table = null;
  this.removeTable = null;
  this.handSolver = null;
  return true;
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
