import { INestApplication } from '@nestjs/common';
import { PermissionsModule } from '@permissions/permissions.module';
import { PermissionsResponseDto } from '@permissions/responses/permissions.response.dto';
import { setupTestingApp } from '@src/app.config';
import { validateAndTransformResponse } from '@src/test-utils/validate-and-transform-response';
import { setupTestingModule } from '@src/test.config';
import request from 'supertest';

describe('Permissions', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const { testingModule } = await setupTestingModule({
      modules: [PermissionsModule],
      mocks: [],
    });
    app = testingModule.createNestApplication();
    setupTestingApp(app);

    await app.init();
  });

  it('should return 200 and get all permissions on GET /permissions', async () => {
    const response = await request(app.getHttpServer()).get(`/permissions`).expect(200);
    for (const item of response.body) {
      const isValid = await validateAndTransformResponse(PermissionsResponseDto, item);
      expect(isValid).toBe(true);
    }
  }, 10000);

  afterAll(async () => {
    await app.close();
  });
});
