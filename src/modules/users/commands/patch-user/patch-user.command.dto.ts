import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class PatchUserCommand {
  @IsNotEmpty()
  @ApiHideProperty()
  id: number;
  @IsOptional()
  rolId?: number;
}
