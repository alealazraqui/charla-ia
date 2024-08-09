import { IQueryHandler, QueryHandler } from '@cqrs';
import { NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../repositories/user.repository';
import { UserDetailResponseDto } from '../../responses/user-detail.response.dto';
import { GetUserMapperDetail } from './get-user-detail.mapper';
import { GetUserDetailQuery } from './get-user-detail.query';

@QueryHandler(GetUserDetailQuery)
export class GetUserDetailQueryHandler implements IQueryHandler<GetUserDetailQuery> {
  constructor(private readonly userRespository: UserRepository) {}

  async execute(query: GetUserDetailQuery): Promise<UserDetailResponseDto> {
    const user = await this.userRespository.getUserById(query.id);
    if (!user) throw new NotFoundException();
    return GetUserMapperDetail.mapDetail(user);
  }
}
