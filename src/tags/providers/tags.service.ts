import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from '../tag.entity';
import { In, Repository } from 'typeorm';
import { CreateTagDto } from '../dtos/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  public async create(createTagDto: CreateTagDto) {
    let NewTag = this.tagRepository.create(createTagDto);
    return await this.tagRepository.save(NewTag);
  }

  public async findMultipleTags(tags: number[]) {
    let results = await this.tagRepository.find({
      where: {
        id: In(tags),
      },
    });

    return results;
  }
}
