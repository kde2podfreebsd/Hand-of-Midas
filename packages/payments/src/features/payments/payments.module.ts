import { SharedModule } from '@features/shared/shared.module';
import { Module } from '@nestjs/common';
import { FakeYookassaService } from './application/integrations/yookassa/services/fake-yookassa.service';
import { YookassaService } from './application/integrations/yookassa/services/yookassa.service';
import { CreatePaymentUsecase } from './application/usecases/create-payment.usecase';
import { ProcessPaymentEventUsecase } from './application/usecases/process-payment-event.usecase';

const services = [YookassaService, FakeYookassaService];
const usecases = [CreatePaymentUsecase, ProcessPaymentEventUsecase];

@Module({
  imports: [SharedModule],
  providers: [...usecases, ...services],
  exports: [...usecases],
})
export class PaymentsModule {}
