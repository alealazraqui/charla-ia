import { INestApplication } from '@nestjs/common';
import { Permission } from '@permissions/entities/permission.entity';
import { Rol } from '@roles/entities/rol.entity';
import { RolMapper } from '@roles/mapper/rol.mapper';
import { RolesRepository } from '@roles/repositories/roles.repository';
import { RolByIdResponseDto } from '@roles/responses/rol-by-id.response.dto';
import { RolesWithPermissionsResponseDto } from '@roles/responses/roles-with-permissions.response.dto';
import { RolesModule } from '@roles/roles.module';
import { setupTestingApp } from '@src/app.config';
import { validateAndTransformResponse } from '@src/test-utils/validate-and-transform-response';
import { setupTestingModule } from '@src/test.config';
import { User } from '@users/entities/user.entity';
import { UserRepository } from '@users/repositories/user.repository';
import { UserModule } from '@users/user.module';
import request from 'supertest';

describe('RolController', () => {
  let app: INestApplication;
  let rolesRepository: RolesRepository;
  let userRepository: UserRepository;

  beforeAll(async () => {
    const { testingModule } = await setupTestingModule({
      modules: [RolesModule, UserModule],
      mocks: [],
    });
    app = testingModule.createNestApplication();
    userRepository = testingModule.get<UserRepository>(UserRepository);
    rolesRepository = testingModule.get<RolesRepository>(RolesRepository);
    setupTestingApp(app);
    await app.init();
  });

  it('should return 200 on GET all roles', async () => {
    const response = await request(app.getHttpServer()).get('/roles').expect(200);
    const roles = response.body as Rol[];

    roles.forEach(async (rol) => {
      const isValid = await validateAndTransformResponse(Rol, rol);
      expect(isValid).toBe(true);
    });
  }, 10000);

  it('should return 200 on GET roles with their permissions ON /roles-with-permissions', async () => {
    const response = await request(app.getHttpServer()).get('/roles/roles-with-permissions').expect(200);
    const roles = response.body as RolesWithPermissionsResponseDto[];

    roles.forEach(async (rolWithPermission) => {
      const isValid = await validateAndTransformResponse(RolesWithPermissionsResponseDto, rolWithPermission);
      expect(isValid).toBe(true);
    });
  }, 10000);

  it('should return 201 on POST rol', async () => {
    const permissions: string[] = ['ROL:INACTIVA', 'SKYLEDER:APROBAR_ARCHIVOS', 'TIPOS_DE_CAMBIO:VER_PROCESO'];

    const response = await request(app.getHttpServer()).post('/roles').send({
      name: 'NEW:ROLTEST',
      description: 'Testing create rol',
      permissions: permissions,
    });

    expect(response.status).toBe(201);
    const result = response.body as Rol;

    const getRol = await rolesRepository.findById(result.id, {}, { permissions: true });
    expect(getRol).not.toBeNull();
    const mapToRol = RolMapper.mapEntityToResponse(getRol!);
    expect(mapToRol.name).toBe('NEW:ROLTEST');
    expect(mapToRol.description).toBe('Testing create rol');
    expect(mapToRol.permissions.sort()).toEqual(permissions.sort());
  }, 10000);

  it('should return 409 conflict when Rol does not exist on POST rol', async () => {
    const permissions: string[] = ['ROL:WRONG', 'SKYLEDER:APROBAR_ARCHIVOS', 'TIPOS_DE_CAMBIO:VER_PROCESO'];

    const response = await request(app.getHttpServer()).post('/roles').send({
      name: 'NEW:ROLTEST',
      description: 'Testing create rol',
      permissions: permissions,
    });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("the permission 'ROL:WRONG' does not exist");
  }, 10000);

  it('should return 200 on PATCH update rol', async () => {
    const createRol = getMockRol();
    const createResponse = await rolesRepository.createEntity(createRol());

    const updatePermissions: string[] = ['ROL:INACTIVA', 'SKYLEDER:APROBAR_ARCHIVOS', 'PAYROLL:VER_PROCESO'];

    const updateResponse = await request(app.getHttpServer())
      .patch(`/roles`)
      .send({
        id: createResponse.id,
        name: 'UPDATED:ROLTEST',
        description: 'Testing update rol',
        permissions: updatePermissions,
      })
      .expect(200);

    const updatedRole = updateResponse.body as Rol;

    const getUpdatedRol = await rolesRepository.findById(updatedRole.id, {}, { permissions: true });
    expect(getUpdatedRol).not.toBeNull();
    const mapToUpdatedRol = RolMapper.mapEntityToResponse(getUpdatedRol!);
    expect(mapToUpdatedRol.name).toBe('UPDATED:ROLTEST');
    expect(mapToUpdatedRol.description).toBe('Testing update rol');
    expect(mapToUpdatedRol.permissions.sort()).toEqual(updatePermissions.sort());
  }, 10000);

  it('should return 409 conflict when Rol does not exist on UPDATE rol', async () => {
    const createRol = getMockRol();
    const createResponse = await rolesRepository.createEntity(createRol());

    const updatePermissions: string[] = ['ROL:INACTIVA', 'SKYLEDER:WRONG', 'PAYROLL:VER_PROCESO'];

    const updateResponse = await request(app.getHttpServer()).patch(`/roles`).send({
      id: createResponse.id,
      name: 'UPDATED:ROLTEST',
      description: 'Testing update rol',
      permissions: updatePermissions,
    });

    expect(updateResponse.status).toBe(409);
    expect(updateResponse.body.message).toBe("the permission 'SKYLEDER:WRONG' does not exist");
  }, 10000);

  it('should return 200 on GET rol by id ON /:id', async () => {
    const createRol = getMockRol();
    const createResponse = await rolesRepository.createEntity(createRol());

    const getByIdResponse = await request(app.getHttpServer()).get(`/roles/${createResponse.id}`).expect(200);

    const rolById = getByIdResponse.body;
    const isValid = await validateAndTransformResponse(RolByIdResponseDto, rolById);
    expect(isValid).toBe(true);
  }, 10000);

  it('should return 404 NotFoundExpception when Id Rol does not exist ON /:id', async () => {
    const getByIdResponse = await request(app.getHttpServer()).get(`/roles/2737243874323443256`);
    expect(getByIdResponse.status).toBe(404);
  }, 10000);

  it('should return 204 on DELETE rol', async () => {
    const createRol = getMockRol();
    const createResponse = await rolesRepository.createEntity(createRol());

    const deleteResponse = await request(app.getHttpServer()).delete(`/roles/${createResponse.id}`);
    expect(deleteResponse.status).toBe(204);
    const getDeletedRol = await rolesRepository.findById(createResponse.id);
    expect(getDeletedRol).toBeNull();
  }, 10000);

  it('should return 409 exception on DELETE, when role was assigned to user ', async () => {
    const createRol = getMockRol();
    const createResponse = await rolesRepository.createEntity(createRol());
    await userRepository.getEntityManager.insert(User, {
      email: 'user-test-to-try-delete@test.com',
      active: true,
      rolId: createResponse.id,
    });
    const deleteResponse = await request(app.getHttpServer()).delete(`/roles/${createResponse.id}`);
    expect(deleteResponse.status).toBe(409);
    await userRepository.getEntityManager.delete(User, { id: createResponse.id });
  }, 10000);

  afterAll(async () => {
    await app.close();
  });
});

function getMockRol() {
  return (): Rol => {
    const rolMock = new Rol();
    rolMock.name = 'ROL_TO_UPDATE';
    rolMock.description = 'Role to be updated';
    rolMock.active = true;
    rolMock.preloaded = true;
    const permission = new Permission();
    permission.name = 'ROL:INACTIVA';
    rolMock.permissions = [permission];
    return rolMock;
  };
}
