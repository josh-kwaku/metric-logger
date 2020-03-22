import {createLogger, format, transports} from "winston";

const logger = createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp({
        format: 'DD-MM-YYYY HH:mm:ss'
      }),
      format.errors({ stack: true }),
      format.splat(),
      format.json()
    ),
    defaultMeta: { service: 'metrics-logger' },
    transports: [
      //
      // - Write to all logs with level `info` and below to `logs/info_logs.log`.
      // - Write all logs error (and below) to `logs/error_logs.log`.
      //
      new transports.File({ filename: 'logs/error_logs.log', level: 'error' }),
      new transports.File({ filename: 'logs/info_logs.log' })
    ]
  });
  
  
  // If we're not in production then **ALSO** log to the `console`
  // with the colorized simple format.
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    }));
  }

export default logger;