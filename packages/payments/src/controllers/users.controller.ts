import { MOCK_USER_ID } from '@common/constants';
import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { UserBalanceResponse } from '@queries/users/dto/user-balance.response';
import { GetUserBalanceQuery } from '@queries/users/get-user-balance.query';

@Controller('/payments/users')
export class UsersController {
  constructor(private userBalanceQuery: GetUserBalanceQuery) {}

  @Get('/balance')
  @ApiOkResponse({ type: UserBalanceResponse })
  public async getBalance(): Promise<UserBalanceResponse> {
    return this.userBalanceQuery.execute(MOCK_USER_ID);
  }
}
