const winston = require('winston');

const { combine, timestamp, printf, colorize } = winston.format;

const consoleFormat = printf(({ level, message, timestamp, ...meta }) => {
  const metaString = Object.keys(meta).length
    ? JSON.stringify(meta, null, 2)
    : '';
  return `${timestamp} [${level}]: ${message} ${metaString}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
  ),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), consoleFormat)
    }),
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
      format: winston.format.json()
    }),
    new winston.transports.File({
      filename: 'combined.log',
      format: winston.format.json()
    })
  ]
});

module.exports = logger;
