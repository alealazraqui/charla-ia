import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from '../entities/permission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionsRepository {
  constructor(
    @InjectRepository(Permission)
    private _permissionRepository: Repository<Permission>,
  ) {}

  async getPermissionByRole(roleId: number): Promise<string[]> {
    const result = await this._permissionRepository.query(
      `SELECT rp.namePermission 
      FROM rol_permission rp 
      WHERE rp.rolId = ${roleId}`,
    );
    return result.map((x: { namePermission: string }) => x.namePermission);
  }

  async getAllPermissions(): Promise<Permission[]> {
    return await this._permissionRepository.find();
  }
}
