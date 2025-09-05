import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ForumService } from './forum.service';
import { CreateForumPostDto } from './dto/create-forum-post.dto';
import { UpdateForumPostDto } from './dto/update-forum-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('forum')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createForumPostDto: CreateForumPostDto, @Request() req) {
    return this.forumService.create(createForumPostDto, req.user.id);
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('category') category?: string,
  ) {
    return this.forumService.findAll(parseInt(page), parseInt(limit), category);
  }

  @Get('categories')
  getCategories() {
    return this.forumService.getCategories();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.forumService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateForumPostDto: UpdateForumPostDto, @Request() req) {
    return this.forumService.update(id, updateForumPostDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    return this.forumService.remove(id, req.user.id);
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  addComment(@Param('id') id: string, @Body() createCommentDto: CreateCommentDto, @Request() req) {
    return this.forumService.addComment(id, createCommentDto, req.user.id);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  toggleLike(@Param('id') id: string, @Request() req) {
    return this.forumService.toggleLike(id, req.user.id);
  }
}
