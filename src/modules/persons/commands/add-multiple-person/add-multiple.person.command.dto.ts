export class AddMultiplePersonCommandDto {
  persons: PersonRequestDto[];
}

export class PersonRequestDto {
  name: string;
  age: number;
  email: string;
}
