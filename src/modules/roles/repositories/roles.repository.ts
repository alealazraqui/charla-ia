import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { RolesWithPermissionsResponseDto } from '@roles/responses/roles-with-permissions.response.dto';
import { EntityManager } from 'typeorm';
import { BaseRepository } from 'typeorm-base-utils';
import { Rol } from '../entities/rol.entity';

@Injectable()
export class RolesRepository extends BaseRepository<Rol> {
  constructor(@InjectEntityManager() entityManager: EntityManager) {
    super(Rol, entityManager);
  }

  async getRoles(): Promise<Rol[]> {
    return await this.findAllWithoutPagination();
  }

  async getRolesWithPermissions(): Promise<RolesWithPermissionsResponseDto[]> {
    const roles = await this.findAllWithoutPagination({
      select: {
        id: true,
        name: true,
        updatedAt: true,
        permissions: { description: true },
      },
      relations: {
        permissions: true,
      },
    });

    return roles.map((role) => ({
      ...role,
      permissions: role.permissions.map((permission) => permission.description),
    }));
  }

  async getRolById(roleId: number): Promise<Rol | null> {
    const rol = await this.findById(
      roleId,
      {},
      {
        permissions: true,
      },
    );

    return rol;
  }
}
