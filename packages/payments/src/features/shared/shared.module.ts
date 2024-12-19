import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';

const modules = [UsersModule];

@Module({
  imports: [...modules],
  exports: [...modules],
})
export class SharedModule {}
