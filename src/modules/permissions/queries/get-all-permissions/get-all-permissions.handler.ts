import { IQueryHandler, QueryHandler } from '@cqrs';
import { PermissionsRepository } from '@permissions/repositories/permissions.repository';
import { PermissionsResponseDto } from '@permissions/responses/permissions.response.dto';
import { GetAllPermissionsQuery } from './get-all-permissions.query.dto';
import { PermissionsMapper } from '@permissions/mappers/permissions.mapper';

@QueryHandler(GetAllPermissionsQuery)
export class GetAllPermissionsQueryHandler implements IQueryHandler<PermissionsResponseDto[]> {
  constructor(private readonly permissionsRepository: PermissionsRepository) {}

  async execute(): Promise<PermissionsResponseDto[]> {
    const permission = await this.permissionsRepository.getAllPermissions();
    return PermissionsMapper.mapEntityToResponse(permission);
  }
}
