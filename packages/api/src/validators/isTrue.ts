import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsTrueConstraint implements ValidatorConstraintInterface {
  validate(value: boolean): boolean {
    return value === true;
  }

  defaultMessage(): string {
    return 'The value must be true';
  }
}

export function IsTrue(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsTrueConstraint
    });
  };
}
