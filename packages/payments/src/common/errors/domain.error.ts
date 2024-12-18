import { HttpException, Logger } from '@nestjs/common';
import { LoggableError } from './loggable.error';
import { TransformableError } from './transformable-error';
import { ErrorCase, httpExceptionFromCase } from './error-case';

export class DomainError
  extends Error
  implements TransformableError, LoggableError
{
  constructor(
    public readonly errorCase: ErrorCase,
    public readonly clientMessage?: string,
    public readonly logMessage?: string,
    public readonly nestedError?: unknown,
  ) {
    super(logMessage || clientMessage || DomainError.name);
    this.name = DomainError.name;
  }

  log(logger: Logger): void {
    logger.warn(this.message, this.nestedError);
  }

  toHttpException(): HttpException {
    return httpExceptionFromCase(this.errorCase, this.clientMessage);
  }
}
