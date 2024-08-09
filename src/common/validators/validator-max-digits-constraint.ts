import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'maxDigits' })
export class MaxDigitsConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    const [maxDigits] = args.constraints;
    return typeof value === 'number' && value.toString().length <= maxDigits;
  }

  defaultMessage(args: ValidationArguments): string {
    const [maxDigits] = args.constraints;
    return `El número de dígitos no puede exceder ${maxDigits} caracteres`;
  }
}

export function maxDigits(maxDigits: number, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'maxDigits',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [maxDigits],
      validator: MaxDigitsConstraint,
    });
  };
}
