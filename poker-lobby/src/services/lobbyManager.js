const Lobby = require('./../models/lobby');

function LobbyManager() {
  this.lobby = new Lobby();
}

module.exports = LobbyManager;
