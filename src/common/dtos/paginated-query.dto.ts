import { IsOptional, IsNumber } from 'class-validator';

export class PaginatedQueryDto {
  @IsOptional()
  @IsNumber()
  page: number;
  @IsNumber()
  @IsOptional()
  limit: number;

  constructor(page = 1, limit = 10) {
    this.page = page;
    this.limit = limit;
  }
}
