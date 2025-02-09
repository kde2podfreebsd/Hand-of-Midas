import { Module, Provider } from '@nestjs/common';
import { CreateUserHandler } from './application/handlers/create-user.handler';

const handlers = [CreateUserHandler];
const usecases: Provider[] = [];

@Module({
  providers: [...handlers, ...usecases],
  exports: [...usecases],
})
export class UsersModule {}
