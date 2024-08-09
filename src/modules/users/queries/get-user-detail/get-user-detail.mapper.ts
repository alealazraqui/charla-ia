import { Rol } from '@roles/entities/rol.entity';
import { User } from '../../entities/user.entity';
import { UserDetailResponseDto } from '../../responses/user-detail.response.dto';
import { RolDetailResponseDto } from '../../responses/rol-detail.response.dto';

export class GetUserMapperDetail {
  static mapDetail(user: User): UserDetailResponseDto {
    const dto = new UserDetailResponseDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.rol = this.transformRol(user.rol);
    return dto;
  }
  private static transformRol(rol: Rol): RolDetailResponseDto {
    const dto = new RolDetailResponseDto();
    dto.id = rol.id;
    dto.name = rol.name;
    dto.permissions = rol.permissions.map((x) => x.name);
    return dto;
  }
}
