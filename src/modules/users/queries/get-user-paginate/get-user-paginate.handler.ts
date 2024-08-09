import { IQueryHandler, QueryHandler } from '@cqrs';
import { UserGetAllResponseDto } from '@users/responses/user-get-all.response.dto';
import { ListResponseDto } from 'typeorm-base-utils';
import { UserRepository } from '../../repositories/user.repository';
import { GetUserPaginateQueryDto } from './get-user-paginate.query.dto';
import { GetUserPaginateMapper } from './get-user-paginate.mapper';

@QueryHandler(GetUserPaginateQueryDto)
export class GetUserPaginateHandler implements IQueryHandler<GetUserPaginateQueryDto> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: GetUserPaginateQueryDto): Promise<ListResponseDto<UserGetAllResponseDto>> {
    const { rolId, email, limit, page } = query;
    const usersByRolId = await this.userRepository.getAllPaginated(page, limit, rolId, email);
    return GetUserPaginateMapper.mapUserListResponse(usersByRolId);
  }
}
