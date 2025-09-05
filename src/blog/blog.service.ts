import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogPost } from '../database/entities/blog-post.entity';
import { Comment } from '../database/entities/comment.entity';
import { Like } from '../database/entities/like.entity';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogPost)
    private blogPostRepository: Repository<BlogPost>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
  ) {}

  async create(createBlogPostDto: CreateBlogPostDto, authorId: string): Promise<BlogPost> {
    const blogPost = this.blogPostRepository.create({
      ...createBlogPostDto,
      authorId,
    });
    return this.blogPostRepository.save(blogPost);
  }

  async findAll(page: number = 1, limit: number = 10, status: string = 'published'): Promise<{ posts: BlogPost[], total: number }> {
    const [posts, total] = await this.blogPostRepository.findAndCount({
      where: { status },
      relations: ['author'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { posts, total };
  }

  async findOne(id: string): Promise<BlogPost> {
    const post = await this.blogPostRepository.findOne({
      where: { id },
      relations: ['author', 'comments', 'comments.author', 'likes'],
    });
    if (!post) {
      throw new NotFoundException('Blog post not found');
    }
    
    // Increment view count
    post.viewCount += 1;
    await this.blogPostRepository.save(post);
    
    return post;
  }

  async update(id: string, updateBlogPostDto: UpdateBlogPostDto, userId: string): Promise<BlogPost> {
    const post = await this.findOne(id);
    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }
    
    Object.assign(post, updateBlogPostDto);
    return this.blogPostRepository.save(post);
  }

  async remove(id: string, userId: string): Promise<void> {
    const post = await this.findOne(id);
    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }
    
    await this.blogPostRepository.remove(post);
  }

  async addComment(postId: string, createCommentDto: CreateCommentDto, authorId: string): Promise<Comment> {
    const post = await this.findOne(postId);
    const comment = this.commentRepository.create({
      ...createCommentDto,
      blogPostId: postId,
      authorId,
    });
    
    const savedComment = await this.commentRepository.save(comment);
    
    // Update comment count
    post.commentCount += 1;
    await this.blogPostRepository.save(post);
    
    return savedComment;
  }

  async toggleLike(postId: string, userId: string): Promise<{ liked: boolean }> {
    const existingLike = await this.likeRepository.findOne({
      where: { blogPostId: postId, userId },
    });

    if (existingLike) {
      await this.likeRepository.remove(existingLike);
      // Decrease like count
      const post = await this.findOne(postId);
      post.likeCount -= 1;
      await this.blogPostRepository.save(post);
      return { liked: false };
    } else {
      const like = this.likeRepository.create({
        blogPostId: postId,
        userId,
      });
      await this.likeRepository.save(like);
      // Increase like count
      const post = await this.findOne(postId);
      post.likeCount += 1;
      await this.blogPostRepository.save(post);
      return { liked: true };
    }
  }
}
