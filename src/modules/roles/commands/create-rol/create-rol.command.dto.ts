import { NotContainOnlyWhiteSpacesStringConstraint } from '@common/validators/validator-string-only-white-spaces';
import { IsArray, IsNotEmpty, IsString, MaxLength, Validate } from 'class-validator';

export class CreateRolCommandDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @Validate(NotContainOnlyWhiteSpacesStringConstraint)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  description: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  permissions: string[];
}
