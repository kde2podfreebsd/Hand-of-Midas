import { CreateUserCommand } from '@features/shared/users/domain/commands/create-user.command';
import { prisma } from '@infrastructure/prisma';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  public async execute({ data }: CreateUserCommand): Promise<void> {
    await prisma.user.upsert({
      where: {
        id: data.id,
      },
      create: {
        id: data.id,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      update: {
        updatedAt: data.updatedAt,
      },
    });
  }
}
