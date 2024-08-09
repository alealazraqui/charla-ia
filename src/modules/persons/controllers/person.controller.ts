import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CommandBus, CqrsController, QueryBus } from '@cqrs';
import { JWTPermissionsGuard } from '@src/modules/auth/guards/jwt-permissions-guard/jwt-permissions.guard';
import { EPermissionsRoles, RequirePermissions } from '@auth';
import { AddMultiplePersonCommandDto } from '../commands/add-multiple-person/add-multiple.person.command.dto';
import { AddMultiplePersonResponseDto } from '../responses/add-multiple-persons.response.dto';

@ApiTags('Person')
@Controller('person')
@ApiBearerAuth()
export class PersonController extends CqrsController {
  constructor(
    readonly commandBus: CommandBus,
    readonly queryBus: QueryBus,
  ) {
    super(queryBus, commandBus);
  }

  @Post('add-multiple')
  @UseGuards(JWTPermissionsGuard)
  @RequirePermissions(EPermissionsRoles.ROL_CREAR)
  async addMultiplePersons(
    @Body() addMultiplePersonCommandDto: AddMultiplePersonCommandDto,
  ): Promise<AddMultiplePersonResponseDto[]> {
    return await this.executeCommand<AddMultiplePersonResponseDto[]>(addMultiplePersonCommandDto);
  }
}
