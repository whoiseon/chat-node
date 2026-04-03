import * as winston from 'winston';

import { env } from '@/common/utils';
import 'winston-daily-rotate-file';

export class Logger {
  private logger: winston.Logger;
  private readonly name: string;

  constructor(name: string) {
    this.name = name;
    const nodeEnv = env.NODE_ENV ?? 'development';

    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          level: nodeEnv === 'production' ? 'http' : 'silly',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf(
              ({ timestamp, level, message }) =>
                `${timestamp} ${level} [${this.name}] ${message}`,
            ),
          ),
        }),
        new winston.transports.DailyRotateFile({
          level: nodeEnv === 'production' ? 'info' : 'silly',
          datePattern: 'YYYY-MM-DD',
          dirname: `./logs/${nodeEnv}`,
          filename: `%DATE%.log`,
          maxFiles: 30,
          zippedArchive: true,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
      ],
    });
  }

  public info(message: string) {
    this.logger.info(message);
  }

  public error(message: string) {
    this.logger.error(message);
  }

  public warn(message: string) {
    this.logger.warn(message);
  }

  public debug(message: string) {
    this.logger.debug(message);
  }

  public verbose(message: string) {
    this.logger.verbose(message);
  }
}
