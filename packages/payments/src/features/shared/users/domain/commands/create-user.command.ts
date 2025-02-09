import { Command } from '@common/domain/command';
import { UserDTO } from '../dto/user.dto';

export class CreateUserCommand extends Command<UserDTO> {}
