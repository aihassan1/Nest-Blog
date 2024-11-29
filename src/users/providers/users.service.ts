import {
  BadRequestException,
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-user-param-users';
import { AuthService } from 'src/auth/providers/auth.service';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { GetPostsDto } from 'src/posts/dtos/get-posts.dto';
import { CreateUserProvider } from './create-user.provider';
import { SignInDto } from 'src/auth/dtos/signin.dto';
import { FindOneUserByEmailProvider } from './find-one-user-by-email.provider';
// class to connect to users table AND perform business ops

@Injectable()
export class UsersService {
  constructor(
    /**injecting config service  */
    private readonly configService: ConfigService,

    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    /**injecting usersRepository*/
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    // inject data source
    @InjectDataSource()
    private readonly dataSource: DataSource,

    // inject create many provider
    private readonly usersCreateMany: UsersCreateManyProvider,

    // inject pagination query
    private readonly paginationProvider: PaginationProvider,
    // inject create user provider
    private readonly createUserProvider: CreateUserProvider,
    // inject find user provider
    private readonly findOneUserByEmailProvider: FindOneUserByEmailProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    return this.createUserProvider.createUser(createUserDto);
  }

  /**GET all the users from the db */
  public async findAll(
    getUsersParamDto: GetUsersParamDto,
    postQuery: GetPostsDto,
  ) {
    const users = await this.paginationProvider.paginateQuery(
      {
        limit: postQuery.limit,
        page: postQuery.page,
      },
      this.usersRepository,
    );
    return users;
  }

  public async findUserByEmail(email: string) {
    console.log(`4- this is the findUserByEmail in users.services`);
    console.log(email);
    return await this.findOneUserByEmailProvider.findUserByEmail(email);
  }

  /** find a user by the id of the user */
  public async findOneById(id: number) {
    let user = undefined;
    try {
      user = await this.usersRepository.findOneBy({ id });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try again later',
        { description: 'Error connecting to the db' },
      );
    }
    if (!user) {
      throw new NotFoundException('the user id is not found', {
        description: 'user is not found in the db',
      });
    }
    return user;
  }

  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    return await this.usersCreateMany.createMany(createManyUsersDto);
  }
}
