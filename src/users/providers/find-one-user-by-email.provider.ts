import {
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindOneUserByEmailProvider {
  constructor(
    // inject users repository
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  public async findUserByEmail(email: string) {
    let user: User | undefined = undefined;
    try {
      user = await this.usersRepository.findOneBy({ email: email });
      console.log(user);
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'could not find the user',
      });
    }
    if (!user) {
      throw new UnauthorizedException('user does not exist  ');
    }
    return user;
  }
}
