import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { BlogPost } from '../database/entities/blog-post.entity';
import { Comment } from '../database/entities/comment.entity';
import { Like } from '../database/entities/like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlogPost, Comment, Like])],
  providers: [BlogService],
  controllers: [BlogController],
})
export class BlogModule {}
