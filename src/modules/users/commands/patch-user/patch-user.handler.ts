import { CommandHandler, ICommandHandler } from '@cqrs';
import { PatchUserCommand } from './patch-user.command.dto';
import { UserRepository } from '../../repositories/user.repository';
import { User } from '@users/entities/user.entity';

@CommandHandler(PatchUserCommand)
export class PatchUserCommandHandler implements ICommandHandler<PatchUserCommand> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: PatchUserCommand): Promise<User> {
    const { rolId, id } = command;
    return this.userRepository.updateEntity(id, { rolId: rolId });
  }
}
