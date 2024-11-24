import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
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
    try {
      const results = await this.tagRepository.find({
        where: {
          id: In(tags),
        },
      });
      if (results.length === 0) {
        throw new NotFoundException('the tags are not found');
      }
      return results;
    } catch (error) {
      throw new RequestTimeoutException('failed to connect to the db');
    }
  }

  public async delete(id: number) {
    await this.tagRepository.delete(id);

    return { deleted: true, id };
  }

  public async softRemove(id: number) {
    await this.tagRepository.softDelete(id);

    return { deleted: true, id };
  }
}
