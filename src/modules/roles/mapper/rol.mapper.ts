import { Permission } from '@permissions/entities/permission.entity';
import { Rol } from '@roles/entities/rol.entity';
import { CreateRolResponseDto } from '@roles/responses/create-rol.response.dto';
import { RolByIdResponseDto } from '@roles/responses/rol-by-id.response.dto';
export class RolMapper {
  static mapEntityToResponse(rol: Rol): CreateRolResponseDto {
    const createRolResponseDto = new CreateRolResponseDto();
    createRolResponseDto.id = rol.id;
    createRolResponseDto.name = rol.name;
    createRolResponseDto.description = rol.description;
    createRolResponseDto.permissions = rol.permissions.map((permission: Permission): string => permission.name);

    return createRolResponseDto;
  }

  static mapEntityToGetById(rol: Rol): RolByIdResponseDto {
    const rolByIdResponseDto = new RolByIdResponseDto();
    rolByIdResponseDto.id = rol.id;
    rolByIdResponseDto.name = rol.name;
    rolByIdResponseDto.description = rol.description;
    rolByIdResponseDto.active = rol.active;
    rolByIdResponseDto.createdAt = rol.createdAt;
    rolByIdResponseDto.updatedAt = rol.updatedAt;
    rolByIdResponseDto.deletedAt = rol.deletedAt;
    rolByIdResponseDto.permissions = rol.permissions.map((permission: Permission): string => permission.name);

    return rolByIdResponseDto;
  }
}
