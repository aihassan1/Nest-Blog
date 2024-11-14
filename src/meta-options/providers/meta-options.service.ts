import { Injectable } from '@nestjs/common';
import { CreatePostMetaOptionDto } from '../dtos/create-post-meta-options.dto';
import { Repository } from 'typeorm';
import { MetaOption } from '../meta-option.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MetaOptionsService {
  constructor(
    /**
     * inject meta option repo so i can deal with the db
     *
     */
    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>,
  ) {}
  public async createMetaOption(
    createPostMetaOptionDto: CreatePostMetaOptionDto,
  ) {
    let metaOption = this.metaOptionRepository.create(createPostMetaOptionDto);
    return await this.metaOptionRepository.save(metaOption);
  }
}
