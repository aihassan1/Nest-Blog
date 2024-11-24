import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { GetPostsDto } from '../dtos/get-posts.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';

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

    private readonly tagsService: TagsService,

    //inject pagination provider
    private readonly paginationProvider: PaginationProvider,
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

    let tags = await this.tagsService.findMultipleTags(createPostDto.tags);
    // create the post
    let post = this.postRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });

    return await this.postRepository.save(post);
  }

  public async findAll(
    postQuery: GetPostsDto,
    userId: string,
  ): Promise<Paginated<Post>> {
    // let posts = await this.postRepository.find({
    //   skip: (postQuery.page - 1) * postQuery.limit,
    //   take: postQuery.limit,
    // });

    let posts = await this.paginationProvider.paginateQuery(
      {
        limit: postQuery.limit,
        page: postQuery.page,
      },
      this.postRepository,
    );

    return posts;
  }

  public async delete(id: number) {
    // find the post
    // delete the post
    // send a confirmation message
    await this.postRepository.delete({ id });
    return { deleted: true, id };
  }

  @Patch()
  public async update(patchPostDTO: PatchPostDto) {
    // find the tags
    let tags = await this.tagsService.findMultipleTags(patchPostDTO.tags);

    if (!tags || tags.length !== patchPostDTO.tags.length) {
      throw new BadRequestException(
        'Please insure that your tags ids are correct',
      );
    }

    // find the post
    let post = undefined;
    try {
      post = await this.postRepository.findOneBy({ id: patchPostDTO.id });
    } catch (error) {
      throw new BadRequestException('Failed to connect to the database');
    }
    if (!post) {
      throw new NotFoundException('Post was not found');
    }

    // update the post
    post.title = patchPostDTO.title ?? post.title;
    post.content = patchPostDTO.content ?? post.content;
    post.status = patchPostDTO.status ?? post.status;
    post.postType = patchPostDTO.postType ?? post.postType;
    post.slug = patchPostDTO.slug ?? post.slug;
    post.featuredImageUrl =
      patchPostDTO.featuredImageUrl ?? post.featuredImageUrl;
    post.publishedOn = patchPostDTO.publishedOn ?? post.publishedOn;

    // Assign the new tags
    post.tags = tags;
    // save and return the post

    try {
      await this.postRepository.save(post);
    } catch (error) {
      throw new BadRequestException('Failed to connect to the database');
    }
    return post;
  }
}
