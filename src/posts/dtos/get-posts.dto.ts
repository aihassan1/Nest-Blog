import { IntersectionType } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';
import { paginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

class getPostsBaseDto {
  @IsDate()
  @IsOptional()
  startDate?: Date;
  @IsDate()
  @IsOptional()
  endDate?: Date;
}

export class GetPostsDto extends IntersectionType(
  paginationQueryDto,
  getPostsBaseDto,
) {}
