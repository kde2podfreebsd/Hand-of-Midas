import { MOCK_USER_ID } from '@common/constants';
import {
  CreatePaymentRequest,
  PaymentProvider,
} from '@features/payments/application/dto/request/create-payment.request';
import { ProcessPaymentEventRequest } from '@features/payments/application/dto/request/process-payment-event.request';
import { CreatePaymentResponse } from '@features/payments/application/dto/response/create-payment.response';
import { CreatePaymentUsecase } from '@features/payments/application/usecases/create-payment.usecase';
import { ProcessPaymentEventUsecase } from '@features/payments/application/usecases/process-payment-event.usecase';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiNoContentResponse } from '@nestjs/swagger';

@Controller('/payments')
export class PaymentsController {
  constructor(
    private readonly createPaymentUsecase: CreatePaymentUsecase,
    private readonly processPaymentEventUsecase: ProcessPaymentEventUsecase,
  ) {}

  @Post('/yookassa')
  @ApiCreatedResponse({ type: CreatePaymentResponse })
  public async createYookassaPayment(
    @Body() request: CreatePaymentRequest,
  ): Promise<CreatePaymentResponse> {
    const confirmationToken = await this.createPaymentUsecase.execute(
      MOCK_USER_ID,
      PaymentProvider.Yookassa,
      request,
    );

    return { confirmationToken };
  }

  @Post('/yookassa/events')
  @ApiNoContentResponse()
  public async processYookassaEvent(
    @Body() request: ProcessPaymentEventRequest,
  ): Promise<void> {
    await this.processPaymentEventUsecase.execute(request);
  }
}
