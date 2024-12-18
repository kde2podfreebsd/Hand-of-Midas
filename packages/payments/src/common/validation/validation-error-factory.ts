import {
  ErrorCase,
  ErrorStatus,
  ValidationErrorData,
  ValidationErrorResponse,
  ValidationTypeMap,
} from '@contracts/errors';
import { ValidationError } from '@nestjs/common';

/** Extracted from ValidationError */
type Constraints = { [type: string]: string };

export class ValidationErrorFactory {
  private readonly message: string[] = [];

  private readonly validation: ValidationErrorData = {};

  public get body(): ValidationErrorResponse {
    return {
      statusCode: ErrorStatus.BAD_REQUEST,
      error: ErrorCase.ValidationError,
      message: [...this.message],
      validation: { ...this.validation },
    };
  }

  constructor(errors: ValidationError[]) {
    for (const { property, constraints, children } of errors) {
      this.appendLevel(property, constraints, children);
    }
  }

  private appendLevel(
    property: string,
    constraints?: Constraints,
    children?: ValidationError[],
  ): void {
    if (this.hasMessages(constraints)) {
      const messages = this.createMap(property);
      this.appendMessages(messages, constraints);
    }

    if (!children?.length) return;

    for (const child of children) {
      const field = `${property}.${child.property}`;
      this.appendLevel(field, child.constraints, child.children);
    }
  }

  private hasMessages(
    constraints: Constraints | undefined,
  ): constraints is Constraints {
    return !!constraints && Object.values(constraints).length > 0;
  }

  private createMap(field: string): ValidationTypeMap {
    if (!this.validation[field]) {
      this.validation[field] = {};
    }

    return this.validation[field];
  }

  private appendMessages(
    messages: ValidationTypeMap,
    constraints: Constraints,
  ): void {
    for (const key in constraints) {
      if (!constraints[key]) continue;

      // eslint-disable-next-line no-param-reassign
      messages[key] = constraints[key];
      this.message.push(constraints[key]);
    }
  }
}
