import { IsNumber } from 'class-validator';

export class GetRolByQuery {
  @IsNumber()
  id: number;

  constructor(id: number) {
    this.id = id;
  }
}
