import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  maxLength,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { PostType } from '../enums/postType.enum';
import { postStatus } from '../enums/postStatus.enum';
import { CreatePostMetaOptionDto } from '../../meta-options/dtos/create-post-meta-options.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'this the title for the blog post ',
    example: 'this is an example title',
  })
  @IsString()
  @MaxLength(512)
  @MinLength(4)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    enum: PostType,
    description: 'Possible values [ post , page, story, series ]',
  })
  @IsEnum(PostType, {
    message:
      'post type must be one of these values [post, page, story, series]',
  })
  @IsNotEmpty()
  postType: PostType;

  @ApiProperty({
    description: "For example - 'my-url' ",
    example: 'my-blog-post',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  slug: string;

  @ApiProperty({
    enum: postStatus,
    description: 'possible values [draft, scheduled,review, published]',
  })
  @IsEnum(postStatus, {
    message:
      'Status type must be one of these values [draft, scheduled,review, published]',
  })
  @IsNotEmpty()
  status: postStatus;

  @ApiPropertyOptional({
    description: 'This is the content of the post',
    example: 'the post content',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    description:
      'You should serialize your JSON object else a validation error will be thrown',
    example:
      '{\r\n "@context": "https://schema.org", \r\n "@type": "Person"\r\n }',
  })
  @IsOptional()
  @IsJSON()
  schema?: string;

  @ApiPropertyOptional({
    description: 'featured Image for your blog post',
    example: 'http://localhost.com/image/12',
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(1024)
  featuredImageUrl?: string;

  @ApiPropertyOptional({
    description: 'the date on which the blog post is published',
    example: '2024-06-26T07:44:33+0000',
  })
  @IsISO8601()
  @IsOptional()
  publishedOn?: Date;

  @ApiPropertyOptional({
    description: 'array of tags for the blog post passed as string values',
    example: ['nestjs', 'typeScript'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  tags: string[];

  @ApiPropertyOptional({
    type: 'object',
    required: false,
    items: {
      type: 'object',
      properties: {
        metaValue: {
          type: 'json',
          description: 'the meta value is a json string',
          example: '{"sidebarEnabled":true}',
        },
      },
    },
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionDto)
  metaOptions?: CreatePostMetaOptionDto | null;
}
