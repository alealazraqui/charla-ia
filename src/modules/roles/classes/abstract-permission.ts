import { ConflictException } from '@nestjs/common';
import { Permission } from '@permissions/entities/permission.entity';
import { PermissionsResponseDto } from '@permissions/responses/permissions.response.dto';

export abstract class AbstractPermission {
  static getValidatedPermissions(
    permissionsToverify: string[],
    allPermissions: PermissionsResponseDto[],
  ): PermissionsResponseDto[] {
    const foundPermissions: PermissionsResponseDto[] = [];
    permissionsToverify.map((permission) => {
      const foundPermission = allPermissions.find((p) => p.name === permission);
      if (foundPermission) {
        foundPermissions.push(foundPermission);
      } else {
        throw new ConflictException(`the permission '${permission}' does not exist`);
      }
    });

    return foundPermissions;
  }

  static setPermissions(permissions: PermissionsResponseDto[]): Permission[] {
    const output: Permission[] = [];
    permissions.map((p) => {
      const permission = new Permission();
      permission.name = p.name;
      permission.module = p.module;
      permission.description = p.description;
      permission.createdAt = new Date(p.createdAt);
      permission.updatedAt = new Date(p.updatedAt);
      output.push(permission);
    });

    return output;
  }
}
