import { IsNotEmpty, IsString } from 'class-validator';

export class GetUserByEmailQuery {
  @IsString()
  @IsNotEmpty()
  email: string;
}
