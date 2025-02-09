import { ControllersModule } from '@controllers/controllers.module';
import { config } from '@infrastructure/config';
import { HTTPLoggerMiddleware, LoggerModule } from '@infrastructure/logger';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule.forRoot(), LoggerModule, ControllersModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(HTTPLoggerMiddleware)
      .exclude({ path: config.healthcheckPrefix, method: RequestMethod.GET })
      .forRoutes('*');
  }
}
