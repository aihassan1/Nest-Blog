import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  public login(email: string, password: string, id: string) {
    // check if the user exists in the db
    const user = this.userService.findOneById('1234');
    return 'Sample_token';
    // login
    // token
  }
  public isAuth() {
    return true;
  }
}
