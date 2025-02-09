import { Payment } from '@a2seven/yoo-checkout';
import { PaymentCurrency } from '@features/payments/application/dto/request/create-payment.request';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { YookassaService } from './yookassa.service';

@Injectable()
export class FakeYookassaService implements YookassaService {
  public async createPayment(
    amount: number,
    currency: PaymentCurrency,
  ): Promise<Payment> {
    const payment = {
      id: randomUUID(),
      status: 'pending',
      amount: {
        value: amount.toFixed(2),
        currency,
      },
      confirmation: {
        type: 'embedded',
        confirmation_token: this.generateConfirmationToken(),
      },
    } as Payment;

    return Promise.resolve(payment);
  }

  private generateConfirmationToken(): string {
    return randomUUID();
  }
}
