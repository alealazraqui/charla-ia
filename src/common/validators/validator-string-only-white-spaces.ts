import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'notContainOnlyWhiteSpacesString', async: false })
export class NotContainOnlyWhiteSpacesStringConstraint implements ValidatorConstraintInterface {
  validate(text: string): boolean {
    return text.trim().length > 0;
  }

  defaultMessage(args: ValidationArguments): string {
    return `The field ${args.property} should not contain only white spaces`;
  }
}
