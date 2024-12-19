import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Handler, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';

@Injectable()
export class HTTPLoggerMiddleware implements NestMiddleware {
  private readonly middleware: Handler;

  constructor(logger: Logger) {
    this.middleware = morgan(
      ':method :url :status :remote-addr - :response-time ms',
      {
        stream: {
          write: (message) => logger.log(message.trim()),
        },
      },
    );
  }

  use(req: Request, res: Response, next: NextFunction): void {
    this.middleware(req, res, next);
  }
}
