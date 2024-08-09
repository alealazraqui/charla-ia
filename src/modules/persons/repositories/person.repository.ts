import { Injectable } from '@nestjs/common';
import { Person } from '../entities/person.entity';

@Injectable()
export class PersonRepository {
  async createPerson(personData: { name: string; age: number; email: string }): Promise<Person> {
    const person = new Person();
    person.name = personData.name;
    person.age = personData.age;
    person.email = personData.email;
    // Simulate saving to the database
    person.id = Math.floor(Math.random() * 1000);
    return person;
  }
}
