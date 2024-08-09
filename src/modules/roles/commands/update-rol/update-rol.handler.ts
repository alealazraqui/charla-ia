import { CommandHandler, ICommandHandler, QueryBus } from '@cqrs';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { GetAllPermissionsQuery } from '@permissions/queries/get-all-permissions/get-all-permissions.query.dto';
import { PermissionsResponseDto } from '@permissions/responses/permissions.response.dto';
import { AbstractPermission } from '@roles/classes/abstract-permission';
import { Rol } from '@roles/entities/rol.entity';
import { RolesRepository } from '@roles/repositories/roles.repository';
import { UpdateRolCommandDto } from './update-rol.command.dto';
import { RolMapper } from '@roles/mapper/rol.mapper';
import { CreateRolResponseDto } from '@roles/responses/create-rol.response.dto';

@CommandHandler(UpdateRolCommandDto)
export class UpdateRolHandler implements ICommandHandler<UpdateRolCommandDto> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly rolesRepository: RolesRepository,
  ) {}

  async execute(command: UpdateRolCommandDto): Promise<CreateRolResponseDto> {
    this.findRoleById(command.id);
    const validatedPermissions = await this.getValidatedPermissions(command.permissions);
    this.ensurePermissionsAreNotEmpty(validatedPermissions);
    const updatedRole = this.buildUpdatedRole(command, validatedPermissions);
    const result = await this.rolesRepository.updateEntity(command.id, updatedRole);

    return RolMapper.mapEntityToResponse(result);
  }

  private async findRoleById(roleId: number): Promise<Rol> {
    const rol = await this.rolesRepository.findById(roleId);
    if (!rol) {
      throw new ConflictException('Rol not found');
    }

    return rol;
  }

  private ensurePermissionsAreNotEmpty(validatedPermissions: PermissionsResponseDto[]): void {
    if (validatedPermissions.length === 0) {
      throw new BadRequestException('No permission has been entered');
    }
  }

  private async getValidatedPermissions(permissionIds: string[]): Promise<PermissionsResponseDto[]> {
    const allPermissions = await this.fetchAllPermissions();
    return AbstractPermission.getValidatedPermissions(permissionIds, allPermissions);
  }

  private async fetchAllPermissions(): Promise<PermissionsResponseDto[]> {
    const getAllPermissionsQuery = new GetAllPermissionsQuery();
    return await this.queryBus.execute<PermissionsResponseDto[]>(getAllPermissionsQuery);
  }

  private buildUpdatedRole(command: UpdateRolCommandDto, validatedPermissions: PermissionsResponseDto[]) {
    const rol = new Rol();
    rol.name = command.name;
    rol.description = command.description;
    rol.permissions = AbstractPermission.setPermissions(validatedPermissions);
    return rol;
  }
}
