import { Payment } from '@a2seven/yoo-checkout';
import { PaymentCurrency } from '@features/payments/application/dto/request/create-payment.request';
import { Injectable } from '@nestjs/common';
import { yookassaSdk } from '../sdk';

@Injectable()
export class YookassaService {
  public async createPayment(
    amount: number,
    currency: PaymentCurrency,
  ): Promise<Payment> {
    const payment = await yookassaSdk.createPayment({
      amount: {
        value: amount.toFixed(2),
        currency,
      },
      confirmation: {
        type: 'embedded',
      },
      capture: true,
      description: `Payment order #${Date.now()}`,
    });

    return payment;
  }
}
