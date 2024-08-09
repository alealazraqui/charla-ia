import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class RolByIdResponseDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  active: boolean;

  @IsDateString()
  @IsNotEmpty()
  createdAt: Date;

  @IsDateString()
  @IsOptional()
  updatedAt: Date;

  @IsDateString()
  @IsOptional()
  deletedAt: Date;

  @IsString({ each: true })
  permissions: string[];
}
