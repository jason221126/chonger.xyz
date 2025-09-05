import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { BlogPost } from './blog-post.entity';
import { ForumPost } from './forum-post.entity';
import { Like } from './like.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @Column({ default: 0 })
  likeCount: number;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  authorId: string;

  @Column({ nullable: true })
  blogPostId: string;

  @Column({ nullable: true })
  forumPostId: string;

  @Column({ nullable: true })
  parentCommentId: string;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @ManyToOne(() => BlogPost, (blogPost) => blogPost.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blogPostId' })
  blogPost: BlogPost;

  @ManyToOne(() => ForumPost, (forumPost) => forumPost.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'forumPostId' })
  forumPost: ForumPost;

  @ManyToOne(() => Comment, (comment) => comment.replies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parentCommentId' })
  parentComment: Comment;

  @OneToMany(() => Comment, (comment) => comment.parentComment)
  replies: Comment[];

  @OneToMany(() => Like, (like) => like.comment)
  likes: Like[];
}
