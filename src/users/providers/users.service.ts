import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
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
import { STATUS_CODES } from 'http';
import { error } from 'console';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { GetPostsDto } from 'src/posts/dtos/get-posts.dto';
/**
 * class to connect to users table AND perform business ops
 */
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
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    // check if the user already exists with the same email
    let existingUser = undefined;
    try {
      existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try again later',
        { description: 'Error connecting to the db' },
      );
    }

    // handle exception

    if (existingUser) {
      throw new BadRequestException(
        'The user already exists please check your email',
      );
    }

    // create a new user
    let newUser = this.usersRepository.create(createUserDto);

    try {
      newUser = await this.usersRepository.save(newUser);
      return newUser;
    } catch (error) {
      throw new RequestTimeoutException('Failed to save the user to  the db', {
        description: 'failed to save the user to the db',
      });
    }
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
