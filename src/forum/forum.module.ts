import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForumService } from './forum.service';
import { ForumController } from './forum.controller';
import { ForumPost } from '../database/entities/forum-post.entity';
import { Comment } from '../database/entities/comment.entity';
import { Like } from '../database/entities/like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ForumPost, Comment, Like])],
  providers: [ForumService],
  controllers: [ForumController],
})
export class ForumModule {}
