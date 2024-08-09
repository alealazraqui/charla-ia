import { IQueryHandler, QueryHandler } from '@cqrs';
import { Rol } from '../../entities/rol.entity';
import { RolesRepository } from '../../repositories/roles.repository';
import { GetRolesWithPermissionsQuery } from './get-roles-with-permissions.query.dto';
import { RolesWithPermissionsResponseDto } from '@roles/responses/roles-with-permissions.response.dto';

@QueryHandler(GetRolesWithPermissionsQuery)
export class GetRolesWithPermissionsHandler implements IQueryHandler<Rol[]> {
  constructor(private readonly rolRepository: RolesRepository) {}

  async execute(): Promise<RolesWithPermissionsResponseDto[]> {
    return await this.rolRepository.getRolesWithPermissions();
  }
}
