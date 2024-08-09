import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateRolHandler } from './commands/create-rol/create-rol.handler';
import { DeleteRolHandler } from './commands/delete-rol/delete-rol.handler';
import { UpdateRolHandler } from './commands/update-rol/update-rol.handler';
import { RolesController } from './controllers/roles.controller';
import { Rol } from './entities/rol.entity';
import { GetAllRolesQueryHandler } from './queries/get-all-roles/get-all-roles.handler';
import { GetRolByIdHandler } from './queries/get-by-id/get-rol-by-id.handler';
import { GetRolesWithPermissionsHandler } from './queries/get-roles-with-permissions/get-all-roles.handler';
import { RolesRepository } from './repositories/roles.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Rol])],
  providers: [
    GetAllRolesQueryHandler,
    RolesRepository,
    GetRolesWithPermissionsHandler,
    CreateRolHandler,
    UpdateRolHandler,
    GetRolByIdHandler,
    DeleteRolHandler,
  ],
  exports: [],
  controllers: [RolesController],
})
export class RolesModule {}
