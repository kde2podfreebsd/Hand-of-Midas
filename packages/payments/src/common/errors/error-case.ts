import {
  ConflictException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { assertExhausted } from '../assert-exhausted';

export enum ErrorCase {
  InternalServerError = 'InternalServerError',
  ArchivedItemUpdate = 'ArchivedItemUpdate',
  NotFound = 'NotFound',
  Conflict = 'Conflict',
}

const errorMessages: { readonly [key in ErrorCase]: string } = {
  [ErrorCase.InternalServerError]: 'Internal server error',
  [ErrorCase.ArchivedItemUpdate]: 'You cannot update archived entities',
  [ErrorCase.NotFound]: 'Entity not found',
  [ErrorCase.Conflict]: 'Entity cannot be saved',
};

export const httpExceptionFromCase = (
  errorCase: ErrorCase,
  message?: string,
): HttpException => {
  switch (errorCase) {
    case ErrorCase.InternalServerError:
      return new InternalServerErrorException(
        message || errorMessages[errorCase],
      );
    case ErrorCase.ArchivedItemUpdate:
      return new ConflictException(message || errorMessages[errorCase]);
    case ErrorCase.NotFound:
      return new NotFoundException(message || errorMessages[errorCase]);
    case ErrorCase.Conflict:
      return new ConflictException(message || errorMessages[errorCase]);

    default:
      return assertExhausted(errorCase);
  }
};
