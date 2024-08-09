import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteRolCommandDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  constructor(id: number) {
    this.id = id;
  }
}
