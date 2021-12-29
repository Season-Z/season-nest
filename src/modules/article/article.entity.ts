import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { CommentEntity } from './comment.entity';

@Entity('article')
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  body: string;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
    name: 'created_at',
    comment: '创建时间',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
    name: 'updated_at',
    comment: '更新时间',
  })
  updateAt: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updateAt = new Date();
  }

  @Column('simple-array')
  tagList: string[];

  @ManyToOne(() => UserEntity, (user) => user.articles)
  author: UserEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.article, { eager: true })
  @JoinColumn()
  comments: CommentEntity[];

  @Column({ default: 0 })
  favoriteCount: number;
}
