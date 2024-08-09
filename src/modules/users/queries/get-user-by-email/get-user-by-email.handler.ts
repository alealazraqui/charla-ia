import { IQueryHandler, QueryHandler } from '@cqrs';
import { GetUserByEmailQuery } from './get-user-by-email.query.dto';
import { UserRepository } from '../../repositories/user.repository';
import { User } from '../../entities/user.entity';

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler implements IQueryHandler<GetUserByEmailQuery> {
  constructor(private readonly userRespository: UserRepository) {}

  async execute(query: GetUserByEmailQuery): Promise<User | null> {
    return await this.userRespository.getUserByEmail(query.email);
  }
}
