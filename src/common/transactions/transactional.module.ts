import { Global, Module } from '@nestjs/common';
import { UnitOfWorkService } from 'typeorm-base-utils';

@Global()
@Module({
  imports: [],
  providers: [UnitOfWorkService],
  exports: [UnitOfWorkService],
  controllers: [],
})
export class TransactionsModule {}
