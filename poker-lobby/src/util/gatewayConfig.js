module.exports = {
  amqp: {
    host: process.env.RMQ_HOST,
    exchange: process.env.RMQ_EXCHANGE,
  },
  ws: {
    port: process.env.PORT,
  },
};
