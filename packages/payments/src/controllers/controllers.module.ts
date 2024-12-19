import { FeaturesModule } from '@features/features.module';
import { Module } from '@nestjs/common';
import { QueriesModule } from '@queries/queries.module';
import { HealthCheckController } from './healthcheck.controller';
import { PaymentsController } from './payments.controller';
import { UsersController } from './users.controller';

@Module({
  controllers: [HealthCheckController, PaymentsController, UsersController],
  imports: [FeaturesModule, QueriesModule],
})
export class ControllersModule {}
