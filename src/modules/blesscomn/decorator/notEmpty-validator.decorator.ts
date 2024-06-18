import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { BlesscomnDto } from '../dto/blesscomn.dto';

export function IsAtLeastOnePropertyNotEmpty(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isAtLeastOnePropertyNotEmpty',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const properties = args.object as BlesscomnDto;

          const validateSomeProperties = [];
          // validateSomeProperties.push(properties.lead)
          validateSomeProperties.push(properties.lead_id);

          return validateSomeProperties.some(
            (property) => property !== '' && property !== null && property !== undefined,
          );
        },
      },
    });
  };
}
