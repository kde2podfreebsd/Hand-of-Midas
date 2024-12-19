import { IAmount } from '@a2seven/yoo-checkout';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentCurrency } from '../request/create-payment.request';

export class PaymentAmountRequest implements Partial<IAmount> {
  @ApiProperty({ type: String })
  value: string;

  @ApiProperty({ enum: PaymentCurrency })
  currency: PaymentCurrency;
}
