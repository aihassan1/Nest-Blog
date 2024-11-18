import { Body, Injectable, Patch } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';

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

  public async findAll(userId: string) {
    let posts = await this.postRepository.find({
      relations: {
        // metaOptions: true,
        // author: true,
        // tags: true,
      },
    });

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
    // find the post
    let post = await this.postRepository.findOneBy({ id: patchPostDTO.id });
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
    return this.postRepository.save(post);
  }
}
