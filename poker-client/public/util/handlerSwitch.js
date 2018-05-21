const logger = require('./logger');
const GameHandler = require('./../handlers/gameHandler');
const LobbyHandler = require('./../handlers/lobbyHandler');

// Singleton support
let instance = null;

function HandlerSwitch(args) {
  this.sessionId = args.sessionId;
  this.gatewayProvider = args.gatewayProvider;
  this.ipcMain = args.ipcMain;
  this.connectionKey = args.connectionKey;
  this.channelKeyLobby = args.channelKeyLobby;
  this.channelKeyGame = args.channelKeyGame;
  this.currentHandler = null;
  this.lobbyHandler = null;
  this.gameHandler = null;
  this.switchHandlers = this.switchHandlers.bind(this);
}

const H = HandlerSwitch.prototype;

H.switchHandlers = function switchHandlers(data) {
  if (this.currentHandler === 'lobby') {
    this.initGame(data);
  } else {
    this.currentHandler = 'lobby';
    this.lobbyHandler.inGame = false;
  }
};

H.initGame = function initGame({ id, location }) {
  this.checkGameHandler();
  this.gameHandler.startAsync(id, location).then(() => {
    this.currentHandler = 'game';
    logger.info('(client) Game services started successfully');
  }).catch((err) => {
    if (err) {
      logger.error(err);
    } else {
      logger.warn('(client) Not all game services have been started correctly');
    }
  });
};

H.initLobby = function initLobby() {
  this.checkLobbyHandler();
  this.lobbyHandler.startAsync().then(() => {
    this.currentHandler = 'lobby';
    logger.info('(client) Services started successfully');
  }).catch((err) => {
    if (err) {
      logger.error(err);
    } else {
      logger.warn('(client) Not all services have been started correctly');
    }
  });
};

H.checkGameHandler = function checkGameHandler() {
  if (!this.gameHandler) {
    this.gameHandler = GameHandler.getInstance({
      sessionId: this.sessionId,
      gatewayProvider: this.gatewayProvider,
      ipcMain: this.ipcMain,
      connectionKey: this.connectionKey,
      channelKey: this.channelKeyGame,
      switchHanldersFunc: this.switchHandlers,
    });
  }
};

H.checkLobbyHandler = function checkLobbyHandler() {
  if (!this.lobbyHandler) {
    this.lobbyHandler = LobbyHandler.getInstance({
      sessionId: this.sessionId,
      gatewayProvider: this.gatewayProvider,
      ipcMain: this.ipcMain,
      connectionKey: this.connectionKey,
      channelKey: this.channelKeyLobby,
      switchHanldersFunc: this.switchHandlers,
    });
  }
};

module.exports = {
  /**
   * [getInstance description]
   * @param  {String} sessionId [description]
   * @return {LobbyHandler}           [description]
   */
  getInstance(args) {
    if (!instance) {
      if (!args) {
        throw new Error('Invalid argument(s)');
      }
      instance = new HandlerSwitch(args);
    }
    return instance;
  },
};
