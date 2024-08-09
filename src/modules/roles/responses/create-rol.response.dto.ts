import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRolResponseDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  permissions: string[];
}
