import { forwardRef, Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './providers/posts.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './providers/post.entity';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { MetaOptionsModule } from 'src/meta-options/meta-options.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([Post, MetaOption]),
    MetaOptionsModule,
  ],
})
export class PostsModule {}
