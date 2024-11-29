import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { HashingProvider } from './providers/hashing.provider';
import { BcryptProvider } from './providers/bcrypt.provider';
import { SignInProvider } from './providers/sign-in.provider';
import { FindOneUserByEmailProvider } from 'src/users/providers/find-one-user-by-email.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    SignInProvider,
    FindOneUserByEmailProvider,
  ],
  exports: [AuthService, HashingProvider],
  imports: [forwardRef(() => UsersModule), TypeOrmModule.forFeature([User])],
})
export class AuthModule {}
