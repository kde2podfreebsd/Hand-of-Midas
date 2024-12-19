import {
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { TransformableError } from './transformable-error';
import { LoggableError } from './loggable.error';

export type DatabaseErrorData = {
  logMessage: string;
  clientMessage?: string;
  nestedError?: unknown;
};

export class DatabaseError
  extends Error
  implements TransformableError, LoggableError
{
  public readonly clientMessage: string;

  public readonly nestedError?: unknown;

  constructor(data: DatabaseErrorData) {
    super(data.logMessage);
    this.name = DatabaseError.name;
    this.clientMessage = data.clientMessage || 'Database error';
    this.nestedError = data.nestedError;
  }

  log(logger: Logger): void {
    logger.error(this.message, this.nestedError);
  }

  toHttpException(): HttpException {
    return new InternalServerErrorException(this.clientMessage);
  }
}
