import { Module } from '@nestjs/common';
import { PaymentsModule } from './payments/payments.module';
import { UsersModule } from './shared/users/users.module';

const modules = [UsersModule, PaymentsModule];

@Module({
  imports: [...modules],
  exports: [...modules],
})
export class FeaturesModule {}
