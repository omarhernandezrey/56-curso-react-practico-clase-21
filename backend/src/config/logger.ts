import winston from 'winston';
import { config } from './environment';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue',
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...args } = info;
    const ts = String(timestamp).slice(0, 19).replace('T', ' ');
    return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
  })
);

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({ filename: 'error.log', level: 'error' }),
  new winston.transports.File({ filename: 'all.log' }),
];

export const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  levels,
  format,
  transports,
});
