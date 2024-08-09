import { Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

// Genérico para representar la clase DTO
export async function validateAndTransformResponse<T>(dtoClass: new () => T, responseBody: any): Promise<boolean> {
  const dto = plainToInstance(dtoClass, responseBody);
  try {
    await validateOrReject(dto as object);
    return true;
  } catch (errors) {
    Logger.error(errors);
    return false;
  }
}
