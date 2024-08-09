import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@users/entities/user.entity';
import { PatchUserCommandHandler } from './commands/patch-user/patch-user.handler';
import { UserPreloadCommandHandler } from './commands/user-preload/user-preload.handler';
import { UserController } from './controllers/user.controller';
import { GetUserByEmailHandler } from './queries/get-user-by-email/get-user-by-email.handler';
import { GetUserByRolIdHandler } from './queries/get-user-by-rol-id/get-user-by-rol-id.handler';
import { GetUserDetailQueryHandler } from './queries/get-user-detail/get-user-detail.handler';
import { GetUserPaginateHandler } from './queries/get-user-paginate/get-user-paginate.handler';
import { UserRepository } from './repositories/user.repository';

const queries = [GetUserByEmailHandler, GetUserDetailQueryHandler, GetUserByRolIdHandler, GetUserPaginateHandler];
const commands = [UserPreloadCommandHandler, PatchUserCommandHandler];
const repositories = [UserRepository];

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [...queries, ...commands, ...repositories],
  exports: [],
  controllers: [UserController],
})
export class UserModule {}
