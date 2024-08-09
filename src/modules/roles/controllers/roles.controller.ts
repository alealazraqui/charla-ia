import { EPermissionsRoles, RequirePermissions } from '@auth';
import { CommandBus, CqrsController, QueryBus } from '@cqrs';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateRolCommandDto } from '@roles/commands/create-rol/create-rol.command.dto';
import { DeleteRolCommandDto } from '@roles/commands/delete-rol/delete-rol.command.dto';
import { UpdateRolCommandDto } from '@roles/commands/update-rol/update-rol.command.dto';
import { GetRolByQuery } from '@roles/queries/get-by-id/get-rol-by-id.query.dto';
import { GetRolesWithPermissionsQuery } from '@roles/queries/get-roles-with-permissions/get-roles-with-permissions.query.dto';
import { CreateRolResponseDto } from '@roles/responses/create-rol.response.dto';
import { RolByIdResponseDto } from '@roles/responses/rol-by-id.response.dto';
import { RolesWithPermissionsResponseDto } from '@roles/responses/roles-with-permissions.response.dto';
import { JWTPermissionsGuard } from '@src/modules/auth/guards/jwt-permissions-guard/jwt-permissions.guard';
import { Rol } from '../entities/rol.entity';
import { GetAllRolesQuery } from '../queries/get-all-roles/get-all-roles.query.dto';

@ApiTags('Roles')
@Controller('roles')
@ApiBearerAuth()
export class RolesController extends CqrsController {
  constructor(
    readonly queryBus: QueryBus,
    readonly commandBus: CommandBus,
  ) {
    super(queryBus, commandBus);
  }

  @Get()
  async getAllRoles(): Promise<Rol[]> {
    return await this.executeQuery(new GetAllRolesQuery());
  }

  @Get('/roles-with-permissions')
  @UseGuards(JWTPermissionsGuard)
  @RequirePermissions(EPermissionsRoles.ROL_VER)
  async getRolesWithPermissions(): Promise<RolesWithPermissionsResponseDto[]> {
    return await this.executeQuery(new GetRolesWithPermissionsQuery());
  }

  @Get(':id')
  @UseGuards(JWTPermissionsGuard)
  @RequirePermissions(EPermissionsRoles.ROL_VER)
  async getRolById(@Param('id') rolId: number): Promise<RolByIdResponseDto> {
    return await this.executeQuery(new GetRolByQuery(rolId));
  }

  @Post()
  @UseGuards(JWTPermissionsGuard)
  @RequirePermissions(EPermissionsRoles.ROL_CREAR)
  async createRole(@Body() createRolCommandDto: CreateRolCommandDto): Promise<CreateRolResponseDto> {
    return await this.executeCommand<CreateRolResponseDto>(createRolCommandDto);
  }

  @Patch()
  @UseGuards(JWTPermissionsGuard)
  @RequirePermissions(EPermissionsRoles.ROL_MODIFICAR)
  async updateRole(@Body() updateRolCommandDto: UpdateRolCommandDto): Promise<CreateRolResponseDto> {
    return await this.executeCommand<CreateRolResponseDto>(updateRolCommandDto);
  }

  @Delete(':id')
  @UseGuards(JWTPermissionsGuard)
  @RequirePermissions(EPermissionsRoles.ROL_INACTIVA)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRol(@Param('id') id: number): Promise<void> {
    const deleteRolCommandDto = new DeleteRolCommandDto(id);
    await this.executeCommand(deleteRolCommandDto);
  }
}
