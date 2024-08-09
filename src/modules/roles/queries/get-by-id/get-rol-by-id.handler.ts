import { IQueryHandler, QueryHandler } from '@cqrs';
import { NotFoundException } from '@nestjs/common';
import { RolMapper } from '@roles/mapper/rol.mapper';
import { RolByIdResponseDto } from '@roles/responses/rol-by-id.response.dto';
import { RolesRepository } from '../../repositories/roles.repository';
import { GetRolByQuery } from './get-rol-by-id.query.dto';

@QueryHandler(GetRolByQuery)
export class GetRolByIdHandler implements IQueryHandler<GetRolByQuery> {
  constructor(private readonly rolRepository: RolesRepository) {}

  async execute(query: GetRolByQuery): Promise<RolByIdResponseDto> {
    const rol = await this.rolRepository.getRolById(query.id);
    if (!rol) throw new NotFoundException(`Rol ${query.id} not found`);
    return RolMapper.mapEntityToGetById(rol);
  }
}
