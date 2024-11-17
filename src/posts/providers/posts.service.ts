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

    //find the author from the db
    let author = await this.userService.findOneById(createPostDto.authorId);

    // create the post
    let post = this.postRepository.create({ ...createPostDto, author: author });

    return await this.postRepository.save(post);
  }

  public async findAll(userId: string) {
    let posts = await this.postRepository.find({});

    return posts;
  }

  public async delete(id: number) {
    // find the post
    // delete the post
    // send a confirmation message
    await this.postRepository.delete({ id });
    return { deleted: true, id };
  }
}
