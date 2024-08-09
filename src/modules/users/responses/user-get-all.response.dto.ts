import { IsBoolean, IsDateString, IsEmail, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { RolNameResponseDto } from './rol-name.response.dto';

export class UserGetAllResponseDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsBoolean()
  @IsNotEmpty()
  active: boolean;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsDateString()
  @IsNotEmpty()
  createdAt: Date;

  @IsDateString()
  @IsOptional()
  updatedAt: Date;

  @IsOptional()
  rol?: RolNameResponseDto;
}
