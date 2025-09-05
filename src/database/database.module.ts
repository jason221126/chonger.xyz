import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BlogPost } from './entities/blog-post.entity';
import { ForumPost } from './entities/forum-post.entity';
import { Comment } from './entities/comment.entity';
import { Like } from './entities/like.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      BlogPost,
      ForumPost,
      Comment,
      Like,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
