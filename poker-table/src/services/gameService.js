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
  const { players, bets } = this.table;
  return this.checkEveryPlayerHasSameBet(players, bets) && this.checkEveryPlayerHadTurn(players);
};

/**
 * [checkEveryPlayerHasSameBet description]
 * @param  {Player[]} players [description]
 * @param  {Object} bets    [description]
 * @return {Boolean}         [description]
 */
G.checkEveryPlayerHasSameBet = function checkEveryPlayerHasSameBet(players, bets) {
  const activePlayerBets = [];
  let totalBet = 0;
  Object.keys(bets).forEach((playerId) => {
    const player = players.find(p => p.id === playerId);
    if (player.status !== 'folded') {
      const activePlayerBet = bets[playerId];
      totalBet += activePlayerBet;
      activePlayerBets.push(activePlayerBet);
    }
  });
  const avgBet = totalBet / activePlayerBets.length;
  return activePlayerBets.every(activeBet => activeBet === avgBet);
};

/**
 * [checkEveryPlayerHadTurn description]
 * @param  {Player[]} players [description]
 * @return {Boolean}         [description]
 */
G.checkEveryPlayerHadTurn = function checkEveryPlayerHadTurn(players) {
  return players.every(p => p.turnNo > 0);
};

/**
 * [nextRoundAsync description]
 * @return {Promise} [description]
 */
G.nextRoundAsync = function nextRoundAsync() {
  return new Promise((resolve, reject) => {
    switch (this.table.gameRound) {
      case 'pre-flop':
        this.addBetsToPot();
        this.startFlopRoundAsync().then(() => { resolve(); }).catch((err) => { reject(err); });
        break;
      case 'flop':
        this.addBetsToPot();
        this.startTurnRound().then(() => { resolve(); }).catch((err) => { reject(err); });
        break;
      case 'turn':
        this.addBetsToPot();
        this.startRiverRound().then(() => { resolve(); }).catch((err) => { reject(err); });
        break;
      case 'river':
        this.addBetsToPot();
        this.startShowdownRound().then(() => { resolve(); }).catch((err) => { reject(err); });
        break;
      default:
        this.startPreFlopRoundAsync().then(() => { resolve(); }).catch((err) => { reject(err); });
    }
  });
};

/**
 * [startPreFlopRoundAsync description]
 * @return {Promise} [description]
 */
G.startPreFlopRoundAsync = function startPreFlopRoundAsync() {
  return new Promise((resolve, reject) => {
    this.setupTableAsync().then(() => {
      this.resetRound();
      this.setSmallBlindBet();
      this.setBigBlindBet();
      this.setPreFlopTurn();
      this.table.gameRound = 'pre-flop';
      resolve(true);
    }).catch((err) => {
      reject(err);
    });
  });
};

G.startFlopRoundAsync = function startFlopRoundAsync() {
  return new Promise((resolve, reject) => {
    this.addCommunityCardsAsync(3).then(() => {
      this.resetRound();
      this.setInitialTurn();
      this.table.gameRound = 'flop';
      resolve();
    }).catch((err) => {
      reject(err);
    });
  });
};

G.startTurnRound = function startTurnRound() {
  return new Promise((resolve, reject) => {
    this.addCommunityCardsAsync(1).then(() => {
      this.resetRound();
      this.setInitialTurn();
      this.table.gameRound = 'turn';
      resolve();
    }).catch((err) => {
      reject(err);
    });
  });
};

G.startRiverRound = function startRiverRound() {
  return new Promise((resolve, reject) => {
    this.addCommunityCardsAsync(1).then(() => {
      this.resetRound();
      this.setInitialTurn();
      this.table.gameRound = 'river';
      resolve();
    }).catch((err) => {
      reject(err);
    });
  });
};

G.startShowdownRound = function startShowdownRound() {
  return new Promise((resolve) => {
    this.resetRound();
    const winData = this.findShowdownWinner();
    this.setWinner(winData.winner);
    console.log('Win Data');
    console.log(winData);
    this.table.gameRound = 'showdown';
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
  nextPlayer.turnNo += 1;
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
    smallBlindPlayer.status = 'small-bet';
    smallBlindPlayer.hasBet = true;
    return this.addToTotalBet(smallBlindPlayer, Math.ceil(minBet / 2));
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
    bigBlindPlayer.status = 'big-bet';
    bigBlindPlayer.hasBet = true;
    return this.addToTotalBet(bigBlindPlayer, minBet);
  }
  return new Error('Can\'t set initial small blind bet without a big blind');
};

G.setInitialTurn = function setInitialTurn() {
  const { players } = this.table;
  const smallBlindPlayer = players.find(p => p.isSmallBlind);
  if (smallBlindPlayer) {
    const previousPlayer = this.getPreviousPlayer(smallBlindPlayer);
    const nextPlayer = this.getNextPlayer(previousPlayer);
    nextPlayer.status = 'turn';
    nextPlayer.hasTurn = true;
    nextPlayer.turnNo = 1;
    return true;
  }
  return new Error('Can\'t set initial turn without a small blind');
};

G.setPreFlopTurn = function setPreFlopTurn() {
  const { players } = this.table;
  const bigBlindPlayer = players.find(p => p.isBigBlind);
  if (bigBlindPlayer) {
    const nextPlayer = this.getNextPlayer(bigBlindPlayer);
    nextPlayer.status = 'turn';
    nextPlayer.hasTurn = true;
    nextPlayer.turnNo += 1;
    return true;
  }
  return new Error('Can\'t set pre flop turn without a big blind');
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

G.addCommunityCardsAsync = function addCommunityCardsAsync(numberOfCards) {
  return new Promise((resolve, reject) => {
    const { communityCards, dealer } = this.table;
    this.gameHandler.getCommunityCardsAsync(numberOfCards, dealer.location).then((cards) => {
      cards.forEach((card) => {
        communityCards.push(card);
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
G.findShowdownWinner = function findShowdownWinner() {
  const { communityCards, playerCards } = this.table;
  let winnerData = null;
  Object.keys(playerCards).forEach((playerId) => {
    const hand = playerCards[playerId];
    const solvedData = this.handSolver.solve(hand.concat(communityCards));
    if (!winnerData || solvedData.points > winnerData.scoreData.points) {
      winnerData = {
        winner: playerId,
        scoreData: solvedData,
      };
    }
  });
  return winnerData;
};

G.setWinner = function setWinner(playerId) {
  const winner = this.table.players.find(p => p.id === playerId);
  winner.amount += this.table.pot;
  Object.values(this.table.bets).forEach((bet) => {
    winner.amount += bet;
  });
  this.table.pot = 0;
  winner.status = 'winner';
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
  const previousPlayer = this.getPreviousPlayer(player);
  const betPreviousPlayer = this.findCurrentBet(previousPlayer);
  const betCurrentPlayer = this.findCurrentBet(player);
  const hasBets = players.some(p => p.hasBet);
  return player.status === 'turn' &&
    !player.hasRaised &&
    (!player.hasBet || player.status !== 'big-bet' || player.status !== 'small-bet') &&
    hasBets &&
    amount >= minRaise + (betPreviousPlayer - betCurrentPlayer);
};

/**
 * [canFold description]
 * @param  {Player} player [description]
 * @return {Boolean}        [description]
 */
G.canFold = function canFold(player) {
  return player.status === 'turn';
};

/**
 * [getNextPlayer description]
 * @param  {Player} currentPlayer [description]
 * @return {Player}               [description]
 */
G.getNextPlayer = function getNextPlayer(player) {
  const { players } = this.table;
  let nextIndex = players.indexOf(player) + 1;
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
G.getPreviousPlayer = function getPreviousPlayer(player) {
  const { players } = this.table;
  let previousIndex = players.indexOf(player) - 1;
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
      /* eslint-disable no-param-reassign */
      player.status = 'waiting';
      player.hasTurn = false;
      player.hasBet = false;
      player.hasRaised = false;
      player.turnNo = 0;
      /* eslint-enable no-param-reassign */
    }
  });
  return true;
};

/**
 * [filterPlayers description]
 * @param  {String}  property          [description]
 * @param  {String}  value             [description]
 * @param  {Boolean} [filterOut=false] [description]
 * @return {Array[]}                    [description]
 */
G.filterPlayers = function filterPlayers(property, value, filterOut = false) {
  return this.table.players.filter((player) => {
    if (filterOut) {
      return player[property] !== value;
    }
    return player[property] === value;
  });
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
