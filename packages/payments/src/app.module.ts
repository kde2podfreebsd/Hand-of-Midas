import { HTTPLoggerMiddleware, LoggerModule } from '@infrastructure/logger';
import { AuthModule } from '@camp/auth-client';
import { config } from '@infrastructure/config';
import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ControllersModule } from '@controllers/controllers.module';

@Module({
  imports: [
    LoggerModule,
    AuthModule.forRootAsync({
      inject: [Logger],
      useFactory: (logger: Logger) => ({
        ...config.auth,
        logger,
      }),
    }),
    ControllersModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(HTTPLoggerMiddleware)
      .exclude({ path: config.healthcheckPrefix, method: RequestMethod.GET })
      .forRoutes('*');
  }
}
