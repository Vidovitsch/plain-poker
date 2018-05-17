module.exports = {
  amqp: {
    host: process.env.RMQ_HOST,
    exchange: process.env.RMQ_EXCHANGE,
  },
  ws: {
    host: process.env.LOBBY_HOST,
    port: process.env.LOBBY_PORT,
  },
};
