import { ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ICommandHandler } from '@nestjs/cqrs';
import { PersonRepository } from '../../repositories/person.repository';
import { AddMultiplePersonResponseDto } from '../../responses/add-multiple-persons.response.dto';
import { AddMultiplePersonCommandDto } from './add-multiple.person.command.dto';

export class AddMultiplePersonHandler implements ICommandHandler<AddMultiplePersonCommandDto> {
  constructor(
    private readonly personRepository: PersonRepository,
    private configService: ConfigService,
  ) {}

  async execute(command: AddMultiplePersonCommandDto): Promise<AddMultiplePersonResponseDto[]> {
    if (!this.configService.get<boolean>('IsAddPersonsFeaturesActivated')) {
      throw new ConflictException();
    }
    const results: AddMultiplePersonResponseDto[] = [];
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < command.persons.length; i++) {
      const person = command.persons[i];

      if (!person.name) {
        throw new Error('Name is required');
      }
      if (person.age < 0) {
        throw new Error('Age must be positive');
      }
      if (!person.email.includes('@')) {
        throw new Error('Invalid email');
      }

      const newPerson = await this.personRepository.createPerson(person);

      results.push({
        id: newPerson.id,
        name: newPerson.name,
        age: newPerson.age,
        email: newPerson.email,
      });
    }
    return results;
  }
}
