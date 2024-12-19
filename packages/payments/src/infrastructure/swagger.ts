import { SERVICE_NAME, USER_AUTH_SWAGGER_NAME } from '@common/constants';
import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { config } from './config';

export function setUpSwagger(app: INestApplication): void {
  const swaggerConfig = new DocumentBuilder()
    .setTitle(SERVICE_NAME)
    .setDescription('Документация API для сервиса оплаты')
    .setVersion('1.0')
    .setContact('Daniel Byta', 'https://t.me/bytadaniel', '@bytadaniel')
    .addBearerAuth(undefined, USER_AUTH_SWAGGER_NAME)
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (_: string, methodKey: string) => methodKey,
    deepScanRoutes: true,
  };

  const document = SwaggerModule.createDocument(app, swaggerConfig, options);
  SwaggerModule.setup(config.swaggerPrefix, app, document);
}
