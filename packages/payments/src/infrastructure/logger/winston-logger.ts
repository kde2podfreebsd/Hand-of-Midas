import { config } from '@infrastructure/config';
import { Injectable, LoggerService } from '@nestjs/common';
import { transports, createLogger, format, Logger } from 'winston';

@Injectable()
export class WinstonLogger implements LoggerService {
  private readonly winston: Logger;

  constructor() {
    this.winston = createLogger({
      exitOnError: false,
      level: config.logLevel,
      format: format.combine(
        format.timestamp(),
        format.json(),
        format.errors({ stack: true }),
      ),
      transports: [new transports.Console({})],
    });
  }

  log(message: unknown, ...optionalParams: unknown[]): void {
    this.winston.info(...this.transform(message, ...optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    this.winston.error(...this.transform(message, ...optionalParams));
  }

  warn(message: unknown, ...optionalParams: unknown[]): void {
    this.winston.warn(...this.transform(message, ...optionalParams));
  }

  debug?(message: unknown, ...optionalParams: unknown[]): void {
    this.winston.debug(...this.transform(message, ...optionalParams));
  }

  verbose(message: unknown, ...optionalParams: unknown[]): void {
    this.winston.verbose(...this.transform(message, ...optionalParams));
  }

  private transform(...params: unknown[]): [message: string, error?: Error] {
    const result = new Array<string>();
    let error: Error | undefined;

    for (const param of params) {
      const next = this.transformOne(param);
      if (typeof next === 'string') result.push(next);
      else error = next;
    }

    return [result.join('; '), error];
  }

  private transformOne(message: unknown): string | Error {
    if (typeof message === 'string') return message;
    if (typeof message !== 'object') return JSON.stringify(message);

    const error = message as Error;
    if (!error.message) return JSON.stringify(message);

    return error;
  }
}
