const winston = require('winston');

module.exports = new winston.Logger({
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      colorize: true,
      timestamp: true,
    }),
  ],
  exitOnError: false,
});
