import { RolDetailResponseDto } from './rol-detail.response.dto';

export class UserDetailResponseDto {
  id: number;
  name: string;
  email: string;
  rol: RolDetailResponseDto;
}
