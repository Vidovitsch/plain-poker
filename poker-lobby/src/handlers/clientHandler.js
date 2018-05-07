function ClientHandler(gatewayProvider, lobbyManager) {
  this.gatewayProvider = gatewayProvider;
  this.lobbyManager = lobbyManager;
}

const C = ClientHandler.prototype;

C.startHandlers = function startHandlers() {
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
    this.tableAmqpGateway.onLobbyUpdate((err, message) => {
      this.lobbyManager.handleUpdate(message.data);
      this.clientSocketGateway.broadcastLobbyUpdate(this.lobbyManager.lobby);
    });
  });
};

C.createGatewaysAsync = function createGatewaysAsync() {
  return new Promise((resolve, reject) => {
    this.gatewayProvider.getClientGatewayAsync('socket', {
      host: '127.0.0.1',
      port: process.env.PORT,
    }).then((clientSocketGateway) => {
      this.clientSocketGateway = clientSocketGateway;
      return this.gatewayProvider.getTableGatewayAsync('amqp', {
        host: process.env.RMQ_HOST,
        port: process.env.RMQ_PORT,
      });
    }).then((tableAmqpGateway) => {
      this.tableAmqpGateway = tableAmqpGateway;
      resolve();
    }).catch((err) => {
      reject(err);
    });
  });
};

module.exports = ClientHandler;
