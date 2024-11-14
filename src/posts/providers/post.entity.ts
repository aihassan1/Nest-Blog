import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostType } from '../enums/postType.enum';
import { postStatus } from '../enums/postStatus.enum';
import { text } from 'stream/consumers';
import { MetaOption } from 'src/meta-options/meta-option.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 512,
  })
  title: string;

  @Column({
    type: 'enum',
    enum: PostType,
    nullable: false,
    default: PostType.POST,
  })
  postType: PostType;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 256,
    unique: true,
    default: postStatus.DRAFT,
  })
  slug: string;

  @Column({ type: 'enum', enum: postStatus })
  status: postStatus;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({ type: 'text', nullable: true })
  schema?: string;

  @Column({ type: 'varchar', nullable: true, length: 1024 })
  featuredImageUrl?: string;

  @Column({ type: 'timestamp', nullable: true })
  publishedOn?: Date;

  @OneToOne(() => MetaOption, {
    cascade: true,
  })
  @JoinColumn()
  metaOptions?: MetaOption;

  // work on these on lectures on relationships
  tags?: string[];
}
