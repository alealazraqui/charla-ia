import { AuthModule } from '@auth';
import { INestApplication } from '@nestjs/common';
import { RolesEnum } from '@roles/enums/roles-enum';
import { RolesModule } from '@roles/roles.module';
import { setupTestingApp } from '@src/app.config';
import { MockUserService } from '@src/test-utils/mock-user.service';
import { validateAndTransformResponse } from '@src/test-utils/validate-and-transform-response';
import { setupTestingModule } from '@src/test.config';
import { User } from '@users/entities/user.entity';
import { ProcessStateExcel } from '@users/enums/process-state.excel.enum';
import { UserRepository } from '@users/repositories/user.repository';
import { UserDetailResponseDto } from '@users/responses/user-detail.response.dto';
import { UserGetAllResponseDto } from '@users/responses/user-get-all.response.dto';
import { UploadExcelAndPreloadUsersDto } from '@users/responses/user.response.dto';
import { UserModule } from '@users/user.module';
import path from 'path';
import request from 'supertest';
import { In } from 'typeorm';

describe('UserController', () => {
  let app: INestApplication;
  let repository: UserRepository;
  let userId: number;
  let user2Id: number;
  let mockUserService: MockUserService;
  let usersToDelete: number[];

  beforeAll(async () => {
    const { testingModule, mockUserService: userService } = await setupTestingModule({
      modules: [UserModule, AuthModule, RolesModule],
      mocks: [],
    });
    app = testingModule.createNestApplication();
    repository = testingModule.get<UserRepository>(UserRepository);
    const users = await repository.getEntityManager.insert(User, {
      email: 'user-test@test.com',
      active: true,
      rolId: RolesEnum.ADMINISTRADOR_GENERAL,
    });
    const users2 = await repository.getEntityManager.insert(User, {
      email: 'user-test2@test.com',
      active: true,
      rolId: RolesEnum.CARGA,
    });
    userId = users.identifiers[0].id;
    user2Id = users2.identifiers[0].id;
    mockUserService = userService;
    setupTestingApp(app);
    await app.init();
  });

  it('should return 200 on GET whoami', async () => {
    const mockUser = {
      id: userId,
      email: 'user-test@test.com',
      rolId: RolesEnum.ADMINISTRADOR_GENERAL,
      rolDescription: 'admin',
    };
    mockUserService.setUser(mockUser);
    const response = await request(app.getHttpServer()).get('/users/whoami').expect(200);
    const user = response.body as UserDetailResponseDto;
    expect(user).toMatchObject({ id: mockUser.id, email: mockUser.email });
    expect(user.rol).toMatchObject({
      id: RolesEnum.ADMINISTRADOR_GENERAL,
      name: expect.any(String),
      permissions: expect.any(Array),
    });
  }, 100000);

  it('should return 200 on PATCH user', async () => {
    const response = await request(app.getHttpServer())
      .patch('/users')
      .send({ id: user2Id, rolId: RolesEnum.SUPER_USUARIO })
      .expect(200);
    const user = response.body as User;
    expect(user.rolId).toBe(RolesEnum.SUPER_USUARIO);
    const findUserResult = await repository.getEntityManager.findOneBy(User, { id: user2Id });
    expect(findUserResult).not.toBeNull();
    expect(findUserResult?.rolId).toBe(RolesEnum.SUPER_USUARIO);
  }, 100000);

  it('should return 200 on PATCH user with rolId as null', async () => {
    const response = await request(app.getHttpServer())
      .patch('/users')
      .send({ id: userId, rolId: null }) // Enviando rolId como null
      .expect(200);
    const user = response.body as User;
    expect(user.rolId).toBeNull(); // Verificar que rolId sea null
    const findUserResult = await repository.getEntityManager.findOneBy(User, { id: userId });
    expect(findUserResult).not.toBeNull();
    expect(findUserResult?.rolId).toBeNull(); // Verificar que en la base de datos también sea null
  }, 100000);

  it('should return 200 on POST upload users', async () => {
    const currentUsers = await repository.getEntityManager.find(User);
    const filePath = path.join(process.cwd(), '/src/test-utils/alta-usuarios.xlsx');

    const response = await request(app.getHttpServer()).post('/users/upload').attach('file', filePath).expect(201);

    const body = response.body as UploadExcelAndPreloadUsersDto;
    expect(body.status).toBe(ProcessStateExcel.SUCCESS);
    const newUsers = await repository.getEntityManager.find(User);
    usersToDelete = [];
    newUsers.forEach((user) => {
      if (!currentUsers.find((current) => current.id === user.id)) {
        usersToDelete.push(user.id);
      }
    });
  }, 10000);

  it('should return 200 on GET get all users', async () => {
    const response = await request(app.getHttpServer()).get('/users/get-all-paginate');
    expect(response.status).toBe(200);

    response.body.results.forEach(async (item: UserGetAllResponseDto) => {
      const isValid = await validateAndTransformResponse(UserGetAllResponseDto, item);
      expect(isValid).toBe(true);
    });
  }, 10000);

  afterAll(async () => {
    if (userId) {
      await repository.getEntityManager.delete(User, { id: userId });
      await repository.getEntityManager.delete(User, { id: user2Id });
    }
    if (usersToDelete) {
      await repository.getEntityManager.delete(User, { id: In(usersToDelete) });
    }
    await app.close();
  });
});
