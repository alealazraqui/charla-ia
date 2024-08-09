import { IQueryHandler, QueryHandler } from '@cqrs';
import { User } from '@users/entities/user.entity';
import { UserRepository } from '../../repositories/user.repository';
import { GetUserByRolIdQuery } from './get-user-by-rol-id.query';

@QueryHandler(GetUserByRolIdQuery)
export class GetUserByRolIdHandler implements IQueryHandler<GetUserByRolIdQuery> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: GetUserByRolIdQuery): Promise<User[] | null> {
    const usersByRolId = await this.userRepository.getUsersByRolId(query.id);
    if (usersByRolId.length == 0) return null;
    return usersByRolId;
  }
}
