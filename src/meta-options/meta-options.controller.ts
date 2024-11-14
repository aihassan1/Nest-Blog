import { Body, Controller, Post } from '@nestjs/common';
import { CreatePostMetaOptionDto } from './dtos/create-post-meta-options.dto';
import { MetaOptionsService } from './providers/meta-options.service';

@Controller('meta-options')
export class MetaOptionsController {
  constructor(
    // injecting the metaOptions service so we can use it here
    private readonly metaOptionsService: MetaOptionsService,
  ) {}
  @Post()
  public create(@Body() createPostMetaOptionDto: CreatePostMetaOptionDto) {
    return this.metaOptionsService.createMetaOption(createPostMetaOptionDto);
  }
}