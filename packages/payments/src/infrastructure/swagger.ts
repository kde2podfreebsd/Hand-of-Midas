import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import {
  API_AUTH_SWAGGER_NAME,
  SERVICE_NAME,
  USER_AUTH_SWAGGER_NAME,
} from '@common/constants';
import { config } from './config';

export function setUpSwagger(app: INestApplication): void {
  const swaggerConfig = new DocumentBuilder()
    .setTitle(SERVICE_NAME)
    .setDescription('Документация API для шаблона backend-сервиса')
    .setVersion('1.0')
    .setContact(
      'Артём',
      'https://t.me/Artiom_Karimov',
      'akarimov@tanos.digital',
    )
    .addBearerAuth(undefined, USER_AUTH_SWAGGER_NAME)
    .addBearerAuth(undefined, API_AUTH_SWAGGER_NAME)
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (_: string, methodKey: string) => methodKey,
    deepScanRoutes: true,
  };

  const document = SwaggerModule.createDocument(app, swaggerConfig, options);
  SwaggerModule.setup(config.swaggerPrefix, app, document);
}
