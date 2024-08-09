import { EPermissionsUsers, GetJWTUser, JWTPermissionsGuard, JwtGuard, RequirePermissions, UserDto } from '@auth';
import { CommandBus, CqrsController, QueryBus } from '@cqrs';
import { Body, Controller, Get, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserPreloadCommand } from '../commands/user-preload/user-preload.command.dto';
import { GetUserDetailQuery } from '../queries/get-user-detail/get-user-detail.query';
import { UserDetailResponseDto } from '../responses/user-detail.response.dto';
import { UploadExcelAndPreloadUsersDto } from '../responses/user.response.dto';
import { PatchUserCommand } from '../commands/patch-user/patch-user.command.dto';
import { User } from '../entities/user.entity';

import { ListResponseDto } from 'typeorm-base-utils';
import { GetUserPaginateQueryDto } from '@users/queries/get-user-paginate/get-user-paginate.query.dto';
import { ApplySwaggerPaginationResponse } from '@common/decorators/apply-swagger-pagination-response.decorator';
import { UserGetAllResponseDto } from '@users/responses/user-get-all.response.dto';

@ApiTags('Users')
@Controller('users')
export class UserController extends CqrsController {
  constructor(
    readonly queryBus: QueryBus,
    readonly commandBus: CommandBus,
  ) {
    super(queryBus, commandBus);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JWTPermissionsGuard)
  @RequirePermissions(EPermissionsUsers.ROL_ASIGNAR)
  async uploadExcelAndPreloadUsers(@UploadedFile() file: Express.Multer.File): Promise<UploadExcelAndPreloadUsersDto> {
    const dto = new UserPreloadCommand();
    dto.file = file;
    return await this.executeCommand(dto);
  }

  @Get('/whoami')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async whoami(@GetJWTUser() user: UserDto): Promise<UserDetailResponseDto> {
    return this.executeQuery<UserDetailResponseDto>(new GetUserDetailQuery(user.id));
  }

  @Patch()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @RequirePermissions(EPermissionsUsers.ROL_ASIGNAR)
  async patchUser(@Body() command: PatchUserCommand): Promise<User> {
    return this.executeCommand<User>(command);
  }

  @Get('/get-all-paginate')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @RequirePermissions(EPermissionsUsers.USUARIO_VER)
  @ApplySwaggerPaginationResponse(UserGetAllResponseDto)
  async getAllPaginate(@Query() query: GetUserPaginateQueryDto): Promise<ListResponseDto<UserGetAllResponseDto>> {
    return this.executeQuery(query);
  }
}
