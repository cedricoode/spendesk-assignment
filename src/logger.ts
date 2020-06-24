import winston from 'winston';

const defaultFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.splat(),
  winston.format.timestamp(),
  winston.format.ms(),
  winston.format.align(),
  winston.format.printf(
    (info) =>
      `${info.timestamp} ${info.level}: ${info.module} | ${info.message} ${info.ms}`
  )
);
const defaultTransport = [new winston.transports.Console()];
let logger = winston.createLogger({
  level: 'silly',
  format: defaultFormat,
  defaultMeta: { module: 'app' },
  transports: defaultTransport,
});

export function createLogger(module: string, level = 'silly') {
  return winston.createLogger({
    level,
    format: defaultFormat,
    defaultMeta: { module },
    transports: defaultTransport,
  });
}

export default logger;
