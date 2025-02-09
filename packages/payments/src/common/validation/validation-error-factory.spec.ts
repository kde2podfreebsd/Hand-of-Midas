import { ValidationError } from '@nestjs/common';
import { ErrorCase, ErrorStatus } from '@contracts/errors';
import { ValidationErrorFactory } from './validation-error-factory';

describe('Validation error formatter tests', () => {
  test('Should process empty error', () => {
    const input: ValidationError[] = [];

    const { body } = new ValidationErrorFactory(input);

    expect(body).toEqual({
      statusCode: ErrorStatus.BAD_REQUEST,
      error: ErrorCase.ValidationError,
      message: [],
      validation: {},
    });
  });

  test('Should process flat error', () => {
    const input: ValidationError[] = [
      {
        property: 'cabbage',
        constraints: {
          min: 'cabbage should be at least 3 inches wide',
          isVegetable: 'cabbage should be a vegetable',
        },
      },
      {
        property: 'desk',
        constraints: {
          isMetal: 'desk should be made of metal',
        },
      },
    ];

    const { body } = new ValidationErrorFactory(input);

    expect(body).toEqual({
      statusCode: ErrorStatus.BAD_REQUEST,
      error: ErrorCase.ValidationError,
      message: expect.arrayContaining([
        'cabbage should be at least 3 inches wide',
        'cabbage should be a vegetable',
        'desk should be made of metal',
      ]),
      validation: {
        cabbage: {
          min: 'cabbage should be at least 3 inches wide',
          isVegetable: 'cabbage should be a vegetable',
        },
        desk: {
          isMetal: 'desk should be made of metal',
        },
      },
    });
  });

  test('Should process nested error', () => {
    const input: ValidationError[] = [
      {
        property: 'cabbage',
        constraints: {
          min: 'cabbage should be at least 3 inches wide',
          isVegetable: 'cabbage should be a vegetable',
        },
      },
      {
        property: 'desk',
        constraints: {
          isMetal: 'desk should be made of metal',
        },
        children: [
          {
            property: 'weight',
            constraints: {
              max: 'weight should be less than 1000',
            },
          },
        ],
      },
    ];

    const { body } = new ValidationErrorFactory(input);

    expect(body).toEqual({
      statusCode: ErrorStatus.BAD_REQUEST,
      error: ErrorCase.ValidationError,
      message: expect.arrayContaining([
        'cabbage should be at least 3 inches wide',
        'cabbage should be a vegetable',
        'desk should be made of metal',
        'weight should be less than 1000',
      ]),
      validation: {
        cabbage: {
          min: 'cabbage should be at least 3 inches wide',
          isVegetable: 'cabbage should be a vegetable',
        },
        desk: {
          isMetal: 'desk should be made of metal',
        },
        'desk.weight': {
          max: 'weight should be less than 1000',
        },
      },
    });
  });
});
