import { UUIDv4 } from '@common/types';
import { prisma } from '@infrastructure/prisma';
import { Injectable } from '@nestjs/common';
import { UserBalanceResponse } from './dto/user-balance.response';

@Injectable()
export class GetUserBalanceQuery {
  public async execute(userId: UUIDv4): Promise<UserBalanceResponse> {
    const deposits = await prisma.deposit.findMany({ where: { userId } });

    return {
      // eslint-disable-next-line no-return-assign, no-param-reassign
      amount: deposits.reduce((sum, deposit) => (sum += deposit.amount), 0),
    };
  }
}
