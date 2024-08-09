import { Permission } from '@permissions/entities/permission.entity';
import { PermissionsResponseDto } from '@permissions/responses/permissions.response.dto';
export class PermissionsMapper {
  static mapEntityToResponse(permissions: Permission[]): PermissionsResponseDto[] {
    const response = permissions.map((permission: Permission): PermissionsResponseDto => {
      const permissionsResponseDto = new PermissionsResponseDto();
      permissionsResponseDto.name = permission.name;
      permissionsResponseDto.description = permission.description;
      permissionsResponseDto.module = permission.module;
      permissionsResponseDto.createdAt = permission.createdAt.toISOString();
      permissionsResponseDto.updatedAt = permission.updatedAt.toISOString();
      return permissionsResponseDto;
    });
    return response;
  }
}
