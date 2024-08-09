import { CommandHandler, ICommandHandler, QueryBus } from '@cqrs';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Rol } from '@roles/entities/rol.entity';
import { RolesRepository } from '@roles/repositories/roles.repository';
import { GetUserByRolIdQuery } from '@users/queries/get-user-by-rol-id/get-user-by-rol-id.query';
import { UserDetailResponseDto } from '@users/responses/user-detail.response.dto';
import { DeleteRolCommandDto } from './delete-rol.command.dto';

@CommandHandler(DeleteRolCommandDto)
export class DeleteRolHandler implements ICommandHandler<DeleteRolCommandDto> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly rolesRepository: RolesRepository,
  ) {}

  async execute(command: DeleteRolCommandDto): Promise<void> {
    this.findRolById(command.id);
    const getUserByRolIdQuery = new GetUserByRolIdQuery(command.id);
    const usersByRolId = await this.queryBus.execute<UserDetailResponseDto[] | null>(getUserByRolIdQuery);
    if (usersByRolId) {
      throw new ConflictException('Cannot delete rol with users assigned to it');
    }

    await this.rolesRepository.deleteById(command.id);
  }

  private async findRolById(rolId: number): Promise<Rol> {
    const rol = await this.rolesRepository.findById(rolId);
    if (!rol) {
      throw new NotFoundException('Rol not found');
    }

    return rol;
  }
}
