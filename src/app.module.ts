import { FilesModule } from '@files/files.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessModule } from '@process/process.module';
import { SuppliersModule } from '@suppliers/supplier.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LogRepository } from '@logs/repositories/log.repository';
import { PermissionsModule } from '@permissions/permissions.module';
import { RolesModule } from '@roles/roles.module';
import { UserModule } from '@users/user.module';
import { TypeOrmConfigService } from './typeorm-config.service';
import { CqrsModule } from '@cqrs';
import { TransactionsModule } from '@common/transactions/transactional.module';
import { AuthModule } from './modules/auth/auth.module';
import { SkyledgerModule } from '@skyledger/skyledger.module';
import { ExchangeRateIntegrationModule } from '@exchangeRateIntegration/exchange-rate-integration.module';
import { LogsModule } from '@logs/logs.module';
import { PayrollModule } from '@payroll/payroll.module';
import { InvoiceWorkflowModule } from '@InvoiceWorkflowModule/invoice-workflow.module';
import { AmosInvoiceModule } from './modules/amos-invoice/amos-invoice.module';
import { SecretsModule } from './modules/secret-manager/secret-manager.module';
import { AmosExchangeRateModule } from './modules/amos-exchange-rate/amos-exchange-rate.module';
import { AmosPurchaseOrderModule } from './modules/amos-purchase-order/amos-purchase-order.module';
import { AmosSupplierModule } from './modules/amos-supplier/amos-supplier.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [(): NodeJS.ProcessEnv => process.env],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    CqrsModule,
    TransactionsModule,
    SecretsModule,
    AuthModule,
    FilesModule,
    ProcessModule,
    SuppliersModule,
    UserModule,
    RolesModule,
    PermissionsModule,
    SkyledgerModule,
    ExchangeRateIntegrationModule,
    LogsModule,
    PayrollModule,
    InvoiceWorkflowModule,
    AmosInvoiceModule,
    AmosExchangeRateModule,
    AmosPurchaseOrderModule,
    SecretsModule,
    AmosSupplierModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    LogRepository,
  ],
  exports: [],
})
export class AppModule {}
