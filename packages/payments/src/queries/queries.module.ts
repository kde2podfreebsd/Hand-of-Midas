import { Module } from '@nestjs/common';
import { GetUserBalanceQuery } from './users/get-user-balance.query';

const queries = [GetUserBalanceQuery];

@Module({ providers: [...queries], exports: [...queries] })
export class QueriesModule {}
