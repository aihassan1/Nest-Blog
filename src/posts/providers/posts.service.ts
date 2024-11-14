import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly userService: UsersService,
    // inject posts repository
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    // inject the meta options repo
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}

  /** create new post */
  public async create(@Body() createPostDto: CreatePostDto) {
    /**
     * create the meta options
     * create the post
     * if meta options -> add the meta options to the post
     * return the post to the user
     */

    let metaOptions = createPostDto.metaOptions
      ? this.metaOptionsRepository.create(createPostDto.metaOptions)
      : null;

    if (metaOptions) {
      await this.metaOptionsRepository.save(metaOptions);
    }

    // create the post
    let post = this.postRepository.create(createPostDto);

    // if meta options -> add the meta options to the post
    if (metaOptions) {
      post.metaOptions = metaOptions;
    }

    return await this.postRepository.save(post);
  }

  public findAll(userId: string) {
    const user = this.userService.findOneById(userId);
    return [
      {
        user: user,
        title: 'Test title',
        content: 'test content',
      },

      {
        user: user,

        title: 'Test title2',
        content: 'test content',
      },
    ];
  }
}
