import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForumPost } from '../database/entities/forum-post.entity';
import { Comment } from '../database/entities/comment.entity';
import { Like } from '../database/entities/like.entity';
import { CreateForumPostDto } from './dto/create-forum-post.dto';
import { UpdateForumPostDto } from './dto/update-forum-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class ForumService {
  constructor(
    @InjectRepository(ForumPost)
    private forumPostRepository: Repository<ForumPost>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
  ) {}

  async create(createForumPostDto: CreateForumPostDto, authorId: string): Promise<ForumPost> {
    const forumPost = this.forumPostRepository.create({
      ...createForumPostDto,
      authorId,
    });
    return this.forumPostRepository.save(forumPost);
  }

  async findAll(page: number = 1, limit: number = 10, category?: string): Promise<{ posts: ForumPost[], total: number }> {
    const where = category ? { category } : {};
    const [posts, total] = await this.forumPostRepository.findAndCount({
      where,
      relations: ['author'],
      order: { isPinned: 'DESC', createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { posts, total };
  }

  async findOne(id: string): Promise<ForumPost> {
    const post = await this.forumPostRepository.findOne({
      where: { id },
      relations: ['author', 'comments', 'comments.author', 'comments.replies', 'comments.replies.author', 'likes'],
    });
    if (!post) {
      throw new NotFoundException('Forum post not found');
    }
    
    // Increment view count
    post.viewCount += 1;
    await this.forumPostRepository.save(post);
    
    return post;
  }

  async update(id: string, updateForumPostDto: UpdateForumPostDto, userId: string): Promise<ForumPost> {
    const post = await this.findOne(id);
    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }
    
    Object.assign(post, updateForumPostDto);
    return this.forumPostRepository.save(post);
  }

  async remove(id: string, userId: string): Promise<void> {
    const post = await this.findOne(id);
    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }
    
    await this.forumPostRepository.remove(post);
  }

  async addComment(postId: string, createCommentDto: CreateCommentDto, authorId: string): Promise<Comment> {
    const post = await this.findOne(postId);
    const comment = this.commentRepository.create({
      ...createCommentDto,
      forumPostId: postId,
      authorId,
    });
    
    const savedComment = await this.commentRepository.save(comment);
    
    // Update comment count
    post.commentCount += 1;
    await this.forumPostRepository.save(post);
    
    return savedComment;
  }

  async toggleLike(postId: string, userId: string): Promise<{ liked: boolean }> {
    const existingLike = await this.likeRepository.findOne({
      where: { forumPostId: postId, userId },
    });

    if (existingLike) {
      await this.likeRepository.remove(existingLike);
      // Decrease like count
      const post = await this.findOne(postId);
      post.likeCount -= 1;
      await this.forumPostRepository.save(post);
      return { liked: false };
    } else {
      const like = this.likeRepository.create({
        forumPostId: postId,
        userId,
      });
      await this.likeRepository.save(like);
      // Increase like count
      const post = await this.findOne(postId);
      post.likeCount += 1;
      await this.forumPostRepository.save(post);
      return { liked: true };
    }
  }

  async getCategories(): Promise<string[]> {
    const result = await this.forumPostRepository
      .createQueryBuilder('forumPost')
      .select('DISTINCT forumPost.category', 'category')
      .getRawMany();
    
    return result.map(item => item.category);
  }
}
