import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RolesWithPermissionsResponseDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  @IsNotEmpty()
  updatedAt: Date;

  @IsString({ each: true })
  permissions: string[];
}
