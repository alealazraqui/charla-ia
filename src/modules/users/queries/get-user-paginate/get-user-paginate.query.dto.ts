import { PaginatedQueryDto } from '@common/dtos/paginated-query.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetUserPaginateQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsNumber()
  rolId: number;

  @IsOptional()
  @IsString()
  email: string;
}
