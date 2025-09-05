import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { BlogPost } from './blog-post.entity';
import { ForumPost } from './forum-post.entity';
import { Comment } from './comment.entity';

@Entity('likes')
@Unique(['user', 'blogPost'])
@Unique(['user', 'forumPost'])
@Unique(['user', 'comment'])
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  blogPostId: string;

  @Column({ nullable: true })
  forumPostId: string;

  @Column({ nullable: true })
  commentId: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => BlogPost, (blogPost) => blogPost.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blogPostId' })
  blogPost: BlogPost;

  @ManyToOne(() => ForumPost, (forumPost) => forumPost.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'forumPostId' })
  forumPost: ForumPost;

  @ManyToOne(() => Comment, (comment) => comment.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'commentId' })
  comment: Comment;
}
