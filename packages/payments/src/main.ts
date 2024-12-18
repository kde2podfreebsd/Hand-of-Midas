import { config } from '@infrastructure/config';
import {
  ClassSerializerInterceptor,
  Logger,
  RequestMethod,
} from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { setUpSwagger } from '@infrastructure/swagger';
import { validationPipe } from '@common/validation';
import { scanResources } from '@infrastructure/scan-resources';
import { SERVICE_NAME } from '@common/constants';
import { GlobalErrorFilter } from '@common/errors';
import { AppModule } from './app.module';

export async function bootstrap(): Promise<NestExpressApplication> {
  const app: NestExpressApplication = await NestFactory.create(AppModule);

  const logger = app.get(Logger);
  app.useLogger(logger);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GlobalErrorFilter(httpAdapter, logger));

  app.enableCors(config.corsOrigin ? { origin: config.corsOrigin } : undefined);
  app.use(helmet());

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.setGlobalPrefix(config.globalPrefix, {
    exclude: [{ path: config.healthcheckPrefix, method: RequestMethod.GET }],
  });

  app.useGlobalPipes(validationPipe());

  if (config.env !== 'production') {
    setUpSwagger(app);
  }

  app.enable('trust proxy');
  app.enableShutdownHooks();

  scanResources(app);
  await app.init();

  await app.listen(config.port, () => {
    logger.log(`${SERVICE_NAME} started on port ${config.port}`);
  });

  return app;
}

// eslint-disable-next-line no-void
void bootstrap();
