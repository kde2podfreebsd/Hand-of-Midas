import { Payment, PaymentStatuses } from '@a2seven/yoo-checkout';
import { UUIDv4 } from '@common/types';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentAmountRequest } from './payment-amount.request';

export class PaymentRequest implements Partial<Payment> {
  @ApiProperty({ type: String })
  id: UUIDv4;

  @ApiProperty({ enum: PaymentStatuses })
  status: PaymentStatuses;

  @ApiProperty({ type: PaymentAmountRequest })
  amount: PaymentAmountRequest;
}
