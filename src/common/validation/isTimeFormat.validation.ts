import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidTimeFormat', async: false })
export class IsValidTimeFormatConstraint implements ValidatorConstraintInterface {
  validate(time: string, args: ValidationArguments) {
    // Regular expression to check if the string is in "HH:MM" format
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(time);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Time ($value) must be in the format HH:MM';
  }
}

export function IsValidTimeFormat(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidTimeFormatConstraint,
    });
  };
}
