import { ApiKeyGuard, JwtGuard, JWTPermissionsGuard } from '@auth';
import { Test, TestingModule } from '@nestjs/testing';
import { AppTestingModule } from './app.testing.module';
import { AzureADStrategy } from './modules/auth/strategies/azuread.strategy';
import { MockUserService } from './test-utils/mock-user.service';
import { TestMockGuard } from './test-utils/test-mock.guard';
import { JwtStrategy } from './modules/auth/strategies/jwt.strategy';
import { SecretsService } from './modules/secret-manager/secret-manager.service';

interface TestingModuleUtils {
  testingModule: TestingModule;
  mockUserService: MockUserService;
}

export async function setupTestingModule(config: {
  modules: any[];
  mocks: { provide: any; useValue: any }[];
}): Promise<TestingModuleUtils> {
  const mockUserService = new MockUserService();
  const moduleBuilder = Test.createTestingModule({
    imports: [AppTestingModule.register(config.modules)],
  });
  const mockGuard = new TestMockGuard(mockUserService);
  moduleBuilder.overrideProvider(SecretsService).useValue({
    // Proporciona un mock del SecretsService
    onModuleInit: jest.fn().mockResolvedValue(true),
    isKeyValid: jest.fn().mockReturnValue(true),
    invalidateApiKeyAndRetry: jest.fn(),
  });
  // Override guards
  moduleBuilder.overrideGuard(ApiKeyGuard).useValue({ canActivate: () => true });
  moduleBuilder.overrideGuard(JWTPermissionsGuard).useValue(mockGuard);
  moduleBuilder.overrideProvider(JwtStrategy).useValue({ validate: () => true });
  moduleBuilder.overrideProvider(AzureADStrategy).useValue({ validate: () => true });
  moduleBuilder.overrideGuard(JwtGuard).useValue(mockGuard);

  config.mocks.forEach((mock) => {
    moduleBuilder.overrideProvider(mock.provide).useValue(mock.useValue);
  });

  const testingModule = await moduleBuilder.compile();
  return { testingModule, mockUserService };
}
