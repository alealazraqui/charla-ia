import { User } from '@users/entities/user.entity';
import { UserGetAllResponseDto } from '@users/responses/user-get-all.response.dto';
import { plainToInstance } from 'class-transformer';
import { ListResponseDto } from 'typeorm-base-utils';

export class GetUserPaginateMapper {
  static mapUserListResponse(userListResponse: ListResponseDto<User>): ListResponseDto<UserGetAllResponseDto> {
    const { results, count, page, limit } = userListResponse;

    const mappedItems = results.map((user) => {
      const userDto = plainToInstance(UserGetAllResponseDto, {
        id: user.id,
        email: user.email,
        active: user.active,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        rol: user.rol
          ? {
              id: user.rol.id,
              name: user.rol.name,
            }
          : null,
      });
      return userDto;
    });

    return {
      results: mappedItems,
      count,
      page,
      limit,
    };
  }
}
