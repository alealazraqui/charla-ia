import { QueryBus } from '@cqrs';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GetAllPermissionsQuery } from '@permissions/queries/get-all-permissions/get-all-permissions.query.dto';
import { PermissionsResponseDto } from '@permissions/responses/permissions.response.dto';
import { AbstractPermission } from '@roles/classes/abstract-permission';
import { Rol } from '@roles/entities/rol.entity';
import { RolMapper } from '@roles/mapper/rol.mapper';
import { RolesRepository } from '@roles/repositories/roles.repository';
import { CreateRolResponseDto } from '@roles/responses/create-rol.response.dto';
import { CreateRolCommandDto } from './create-rol.command.dto';

@CommandHandler(CreateRolCommandDto)
export class CreateRolHandler implements ICommandHandler<CreateRolCommandDto> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly rolesRepository: RolesRepository,
  ) {}

  async execute(command: CreateRolCommandDto): Promise<CreateRolResponseDto> {
    const validatedPermissions = await this.getValidatedPermissions(command.permissions);
    this.ensurePermissionsAreNotEmpty(validatedPermissions);
    const newRol = await this.createRole(command, validatedPermissions);

    return RolMapper.mapEntityToResponse(newRol);
  }

  private async getValidatedPermissions(permissionIds: string[]): Promise<PermissionsResponseDto[]> {
    const allPermissions = await this.fetchAllPermissions();
    return AbstractPermission.getValidatedPermissions(permissionIds, allPermissions);
  }

  private async fetchAllPermissions(): Promise<PermissionsResponseDto[]> {
    const query = new GetAllPermissionsQuery();
    return await this.queryBus.execute<PermissionsResponseDto[]>(query);
  }

  private ensurePermissionsAreNotEmpty(validatedPermissions: PermissionsResponseDto[]): void {
    if (validatedPermissions.length === 0) {
      throw new BadRequestException('No permission has been entered');
    }
  }

  private async createRole(command: CreateRolCommandDto, validatedPermissions: PermissionsResponseDto[]): Promise<Rol> {
    const rol = this.buildNewRol(command, validatedPermissions);
    return await this.rolesRepository.createEntity(rol);
  }

  private buildNewRol(command: CreateRolCommandDto, validatedPermissions: PermissionsResponseDto[]): Rol {
    const role = new Rol();
    role.name = command.name;
    role.description = command.description;
    role.permissions = AbstractPermission.setPermissions(validatedPermissions);
    role.active = true;
    role.preloaded = true;
    return role;
  }
}
