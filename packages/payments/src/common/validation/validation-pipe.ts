import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationErrorFactory } from './validation-error-factory';

export function validationPipe(): ValidationPipe {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    exceptionFactory: (errors: ValidationError[]): never => {
      const factory = new ValidationErrorFactory(errors);
      throw new BadRequestException(factory.body);
    },
  });
}
