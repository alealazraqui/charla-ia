import { IQueryHandler, QueryHandler } from '@cqrs';
import { GetAllRolesQuery } from './get-all-roles.query.dto';
import { RolesRepository } from '../../repositories/roles.repository';
import { Rol } from '../../entities/rol.entity';

@QueryHandler(GetAllRolesQuery)
export class GetAllRolesQueryHandler implements IQueryHandler<Rol[]> {
  constructor(private readonly rolRepository: RolesRepository) {}

  async execute(): Promise<Rol[]> {
    return await this.getAllRoles();
  }

  private async getAllRoles(): Promise<Rol[]> {
    return await this.rolRepository.getRoles();
  }
}
