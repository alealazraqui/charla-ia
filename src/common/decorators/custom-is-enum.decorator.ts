/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, ValidationOptions } from 'class-validator';

// eslint-disable-next-line @typescript-eslint/naming-convention
export function IsEnumSwagger(enumObject: Record<string, any>, validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): void {
    // Aplica la validación de enum
    IsEnum(enumObject, validationOptions)(object, propertyName);

    // Aplica la documentación de Swagger
    ApiProperty({
      enum: enumObject,
      enumName: Object.keys(enumObject)
        .filter((key) => isNaN(parseInt(key)))
        .join(', '),
      description: generateEnumDescription(enumObject),
    })(object, propertyName);
  };
}

function generateEnumDescription(enumObject: Record<string, any>): string {
  const enumKeys = Object.keys(enumObject).filter((key) => isNaN(parseInt(key)));
  const enumValues = enumKeys.map((key) => `${key}: ${enumObject[key]}`);
  return enumValues.join(', ');
}
