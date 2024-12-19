import { Logger } from '@nestjs/common';

export interface LoggableError {
  log(logger: Logger): void;
}
