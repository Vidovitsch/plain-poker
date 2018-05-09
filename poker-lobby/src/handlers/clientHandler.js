function ClientHandler(gatewayProvider, lobbyManager) {
  this.gatewayProvider = gatewayProvider;
  this.lobbyManager = lobbyManager;
  this.clientSocketGateway = gatewayProvider.getClientGateway('ws');
  this.tableAmqpGateway = gatewayProvider.getTableGateway('amqp');
}

const C = ClientHandler.prototype;

C.startHandlers = function startHandlers(channelKey) {
  // Handler for each connected client
  this.clientSocketGateway.onClientConnected((client) => {
    console.log(`New client connected: ${client.id}`);
    // On client disconnected
    this.clientSocketGateway.onClientDisconnected(client, () => {
      console.log(`Client diconnected: ${client.id}`);
    });
    // Lobby request/reply
    this.clientSocketGateway.onLobbyRequest(client, (requestMessage) => {
      console.log(requestMessage);
      this.clientSocketGateway.sendLobbyReply(client, this.lobbyManager.lobby, requestMessage);
    });
    // Lobby update handling
    this.tableAmqpGateway.onLobbyUpdate(channelKey, (err, message) => {
      this.lobbyManager.handleUpdate(message.data);
      this.clientSocketGateway.broadcastLobbyUpdate(this.lobbyManager.lobby);
    });
  });
};

module.exports = ClientHandler;
