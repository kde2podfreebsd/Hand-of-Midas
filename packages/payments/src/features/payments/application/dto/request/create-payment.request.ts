import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export enum PaymentProvider {
  Yookassa = 'yookassa',
}

export enum PaymentCurrency {
  RUB = 'RUB',
}

export class CreatePaymentRequest {
  @IsNotEmpty()
  @IsEnum(PaymentProvider)
  @ApiProperty({ enum: PaymentProvider })
  provider: PaymentProvider;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @ApiProperty({ type: Number })
  amount: number;

  @IsNotEmpty()
  @IsEnum(PaymentCurrency)
  @ApiProperty({ enum: PaymentCurrency })
  currency: PaymentCurrency;
}
