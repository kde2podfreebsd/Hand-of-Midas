import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { PaymentRequest } from '../common/payment.request';

export enum PaymentEvent {
  Success = 'payment.succeeded',
  Close = 'payment.canceled',
}

export class ProcessPaymentEventRequest {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: 'notification' })
  type: 'notification';

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ enum: PaymentEvent })
  event: PaymentEvent;

  @IsNotEmpty()
  @IsObject()
  @ApiProperty({ type: PaymentRequest })
  object: PaymentRequest;
}
