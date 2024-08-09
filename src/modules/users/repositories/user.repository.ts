import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { BaseRepository, ListResponseDto } from 'typeorm-base-utils';
import { User } from '../entities/user.entity';
import { EntityManager, FindManyOptions, FindOptionsWhere, Like } from 'typeorm';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(@InjectEntityManager() entityManager: EntityManager) {
    super(User, entityManager);
  }

  async upsertUser(user: User): Promise<void> {
    const existingUser = await this.repositoryEntityManager.findOne(User, { where: { email: user.email } });

    if (existingUser) {
      await this.updateEntity(existingUser.id, user);
    } else {
      await this.saveEntity(user);
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.repositoryEntityManager.findOne(User, { where: { email: email }, relations: ['rol'] });
    return user;
  }

  async getUserById(id: number): Promise<User | null> {
    const user = await this.findById(
      id,
      {
        rol: {
          id: true,
          name: true,
          permissions: true,
        },
      },
      {
        rol: { permissions: true },
      },
    );
    return user;
  }

  async getUsersByRolId(rolId: number): Promise<User[]> {
    const users = await this.repositoryEntityManager.find(User, { where: { rolId: rolId }, relations: { rol: true } });
    return users;
  }

  async getAllPaginated(page = 1, limit = 10, rolId?: number, email?: string): Promise<ListResponseDto<User>> {
    const where: FindOptionsWhere<User> = {};

    if (rolId) {
      where.rolId = rolId;
    }

    if (email) {
      where.email = Like(`%${email}%`);
    }

    const options: FindManyOptions<User> = {
      where,
      select: {
        id: true,
        email: true,
        active: true,
        createdAt: true,
        updatedAt: true,
        rol: { id: true, name: true },
      },
      relations: { rol: true },
    };

    return this.findAll(page, limit, options);
  }
}
