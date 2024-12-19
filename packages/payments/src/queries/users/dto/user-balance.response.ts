import { ApiProperty } from '@nestjs/swagger';

export class UserBalanceResponse {
  @ApiProperty({ type: Number })
  amount: number;
}
