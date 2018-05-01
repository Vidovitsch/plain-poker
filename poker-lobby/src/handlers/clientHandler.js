function ClientHandler(gatewayProvider, lobbyManager) {
  this.gatewayProvider = gatewayProvider;
  this.lobbyManager = lobbyManager;
  this.clientSocketGateway = gatewayProvider.getClientGateway('socket', {
    host: '127.0.0.1',
    port: process.env.PORT,
  });
}

const C = ClientHandler.prototype;

C.startHandlers = function startHandlers() {
  // Handler for each connected client
  this.clientSocketGateway.onClientConnected((client) => {
    console.log(`New client connected: ${client.id}`);
    this.clientSocketGateway.onClientDisconnected(client, () => {
      console.log(`Client diconnected: ${client.id}`);
    });
    // Lobby request/reply
    this.clientSocketGateway.onLobbyRequest(client, (requestMessage) => {
      console.log(requestMessage);
      this.clientSocketGateway.sendLobbyReply(client, this.lobbyManager.lobby, requestMessage);
    });
  });
};

module.exports = ClientHandler;
