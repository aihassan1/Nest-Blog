import {
  BadRequestException,
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

@Injectable()
export class UsersCreateManyProvider {
  constructor(
    // inject data source
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}
  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    let newUsers: User[] = [];
    // create a Query runner
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      // connect the query runner to the data source
      await queryRunner.connect();
      // Start the transaction
      queryRunner.startTransaction();
    } catch (error) {
      throw new RequestTimeoutException(
        'error creating the query runner - could not connect to the database',
      );
    }

    try {
      for (let user of createManyUsersDto.users) {
        let newUser = queryRunner.manager.create(User, user);
        let result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }
      // if successful commit.
      await queryRunner.commitTransaction();
    } catch (error) {
      // if unsuccessful roll back
      await queryRunner.rollbackTransaction();

      throw new ConflictException(
        'error when creating new users : could not complete the transaction',
        { description: String(error) },
      );
    } finally {
      // release the connection
      await queryRunner.release();
    }
    return newUsers;
  }
}
