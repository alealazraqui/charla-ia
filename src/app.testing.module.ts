import { TransactionsModule } from '@common/transactions/transactional.module';
import { CqrsModule } from '@cqrs';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmConfigTestingService } from './typeorm-testing-config.service';
import { SecretsModule } from './modules/secret-manager/secret-manager.module';
// Importa otros módulos que necesites

@Module({})
export class AppTestingModule {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static register(modules: any[]): DynamicModule {
    return {
      module: AppTestingModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
          load: [(): NodeJS.ProcessEnv => process.env],
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useClass: TypeOrmConfigTestingService,
        }),
        CqrsModule,
        TransactionsModule,
        SecretsModule,
        AuthModule,
        ...modules, // Agrega los módulos pasados dinámicamente
      ],
      controllers: [],
      providers: [],
    };
  }
}
