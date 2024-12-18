import { Global, Logger, Module } from '@nestjs/common';
import { WinstonLogger } from './winston-logger';

@Global()
@Module({
  providers: [
    {
      provide: Logger,
      useClass: WinstonLogger,
    },
  ],
  exports: [Logger],
})
export class LoggerModule {}
