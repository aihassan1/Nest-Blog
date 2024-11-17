import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-post.dto';
@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  /**
   * Get localhost:3000/posts/:userId
   */
  @Get('/:userId?')
  public getPosts(@Param('userId') userId: string) {
    return this.postsService.findAll(userId);
  }

  @ApiResponse({
    status: 201,
    description:
      'you get a 201 response if your post was created successfully ',
  })
  @ApiOperation({ summary: 'create a new post' })
  @ApiBody({ type: CreatePostDto })
  @Post()
  public createPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @ApiResponse({
    status: 200,
    description:
      'you get a 200 response if your patch request done successfully',
  })
  @ApiOperation({
    summary: 'edit an existing post ',
  })
  @Patch()
  public updatePost(@Body() patchPostDTO: PatchPostDto) {
    console.log(patchPostDTO);
  }

  @Delete()
  public deletePost(@Query('id', ParseIntPipe) id: number) {
    return this.postsService.delete(id);
  }
}
