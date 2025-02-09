import { HttpException } from '@nestjs/common';

export interface TransformableError {
  toHttpException(): HttpException;
}
