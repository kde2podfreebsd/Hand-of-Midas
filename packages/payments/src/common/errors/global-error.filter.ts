import {
  Catch,
  ArgumentsHost,
  HttpException,
  InternalServerErrorException,
  Injectable,
  ExceptionFilter,
  Logger,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { AbstractHttpAdapter } from '@nestjs/core';
import { DatabaseError } from './database.error';
import { DomainError } from './domain.error';

@Catch()
@Injectable()
export class GlobalErrorFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapter: AbstractHttpAdapter,
    private readonly logger: Logger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    if (exception instanceof HttpException) {
      return this.respond(exception, ctx);
    }

    return this.respond(this.transform(exception), ctx);
  }

  private transform(error: unknown): HttpException {
    if (error instanceof DatabaseError || error instanceof DomainError) {
      error.log(this.logger);

      return error.toHttpException();
    }

    return this.transformUnknown(error);
  }

  private transformUnknown(error: unknown): HttpException {
    this.logger.error('Unknown error', error);

    return new InternalServerErrorException('Unknown error');
  }

  private respond(exception: HttpException, ctx: HttpArgumentsHost): void {
    this.httpAdapter.reply(
      ctx.getResponse(),
      exception.getResponse(),
      exception.getStatus(),
    );
  }
}
