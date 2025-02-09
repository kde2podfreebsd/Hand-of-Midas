import { Model } from '@common/domain/model';
import { CreateUserCommand } from '../commands/create-user.command';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UserDTO } from '../dto/user.dto';

export class UserModel extends Model<UserDTO> {
  public static create(dto: CreateUserDTO): UserModel {
    const user = new UserModel({
      id: dto.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    user.addCommand(new CreateUserCommand(user.toDTO()));

    return user;
  }
}
