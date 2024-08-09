import { Module } from '@nestjs/common';
import { PermissionsRepository } from './repositories/permissions.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { PermissionsController } from './controllers/permissions.controller';
import { GetAllPermissionsQueryHandler } from './queries/get-all-permissions/get-all-permissions.handler';

@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
  providers: [PermissionsRepository, GetAllPermissionsQueryHandler],
  exports: [PermissionsRepository],
  controllers: [PermissionsController],
})
export class PermissionsModule {}
