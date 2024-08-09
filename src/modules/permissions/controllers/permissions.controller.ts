import { CommandBus, CqrsController, QueryBus } from '@cqrs';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionsResponseDto } from '@permissions/responses/permissions.response.dto';
import { JWTPermissionsGuard } from '@src/modules/auth/guards/jwt-permissions-guard/jwt-permissions.guard';
import { GetAllPermissionsQuery } from '../queries/get-all-permissions/get-all-permissions.query.dto';
import { RequirePermissions } from '@src/modules/auth/decorators/require-permissions.decorator';
import { EPermissionsRoles } from '@src/modules/auth/enums/modules-permissions.enum';

@ApiTags('Permissions')
@Controller('permissions')
@ApiBearerAuth()
export class PermissionsController extends CqrsController {
  constructor(
    readonly queryBus: QueryBus,
    readonly commandBus: CommandBus,
  ) {
    super(queryBus, commandBus);
  }

  @Get()
  @UseGuards(JWTPermissionsGuard)
  @RequirePermissions(EPermissionsRoles.ROL_VER)
  async getAllPermissions(): Promise<PermissionsResponseDto[]> {
    return await this.executeQuery(new GetAllPermissionsQuery());
  }
}
