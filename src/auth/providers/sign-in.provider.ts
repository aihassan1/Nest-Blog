import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dto';
import { UsersService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { FindOneUserByEmailProvider } from 'src/users/providers/find-one-user-by-email.provider';

@Injectable()
export class SignInProvider {
  constructor(
    // inject user service
    // @Inject(forwardRef(() => UsersService))
    // private readonly userService: UsersService,

    private readonly findOneUserByEmailProvider: FindOneUserByEmailProvider,
    // inject auth service
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async signIn(signInDto: SignInDto) {
    // find the user based on email
    // throw an exception if user is not found
    let user = await this.findOneUserByEmailProvider.findUserByEmail(
      signInDto.email,
    );
    // compare the password that was sent by the user to the hash in the db
    let isEqual: boolean = true;
    try {
      isEqual = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'could not compare passwords',
      });
    }

    if (!isEqual) {
      throw new UnauthorizedException('Incorrect Password ');
    }

    // send confirmation - later we will send a token
    return true;
  }
}
