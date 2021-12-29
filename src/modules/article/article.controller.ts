import {
  Get,
  Post,
  Body,
  Put,
  Delete,
  Query,
  Param,
  Controller,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { CreateArticleDto, CreateCommentDto } from './dto';
import { ArticlesRO, ArticleRO } from './article.interface';
import { CommentsRO } from './article.interface';
import { UserDecorator } from '../../decorator/user.decorator';

@ApiBearerAuth()
@ApiTags('articles')
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiOperation({ summary: '获取所有文章' })
  @ApiResponse({ status: 200, description: '返回所有文章' })
  @Get()
  async findAll(@Query() query): Promise<ArticlesRO> {
    return await this.articleService.findAll(query);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug): Promise<ArticleRO> {
    return await this.articleService.findOne({ slug });
  }

  @ApiOperation({ summary: '创建文章' })
  @ApiResponse({ status: 201, description: '文章创建成功' })
  @ApiResponse({ status: 403, description: '无权限' })
  @Post()
  async create(
    @UserDecorator('id') userId: number,
    @Body('article') articleData: CreateArticleDto,
  ) {
    return this.articleService.create(userId, articleData);
  }

  @ApiOperation({ summary: '更新文章' })
  @ApiResponse({ status: 201, description: '文章更新成功' })
  @ApiResponse({ status: 403, description: '无权限' })
  @Put(':slug')
  async update(
    @Param('slug') slug,
    @Body('article') articleData: CreateArticleDto,
  ) {
    return this.articleService.update(slug, articleData);
  }

  @ApiOperation({ summary: '删除文章' })
  @ApiResponse({ status: 201, description: '文章删除成功' })
  @ApiResponse({ status: 403, description: '无权限' })
  @Delete(':slug')
  async delete(@Param() params) {
    return this.articleService.delete(params.slug);
  }

  @Get(':slug/comments')
  async findComments(@Param('slug') slug): Promise<CommentsRO> {
    return await this.articleService.findComments(slug);
  }

  @ApiOperation({ summary: '创建评论' })
  @ApiResponse({ status: 201, description: '评论创建成功' })
  @ApiResponse({ status: 403, description: '无权限' })
  @Post(':slug/comments')
  async createComment(
    @Param('slug') slug,
    @Body('comment') commentData: CreateCommentDto,
  ) {
    return await this.articleService.addComment(slug, commentData);
  }

  @ApiOperation({ summary: '删除评论' })
  @ApiResponse({ status: 201, description: '评论删除成功' })
  @ApiResponse({ status: 403, description: '无权限' })
  @Delete(':slug/comments/:id')
  async deleteComment(@Param() params) {
    const { slug, id } = params;
    return await this.articleService.deleteComment(slug, id);
  }

  @ApiOperation({ summary: '喜欢文章' })
  @ApiResponse({ status: 201, description: '喜欢文章成功' })
  @ApiResponse({ status: 403, description: '无权限' })
  @Post(':slug/favorite')
  async favorite(@UserDecorator('id') userId: number, @Param('slug') slug) {
    return await this.articleService.favorite(userId, slug);
  }

  @ApiOperation({ summary: '取消喜欢文章' })
  @ApiResponse({ status: 201, description: '取消喜欢文章成功' })
  @ApiResponse({ status: 403, description: '无权限' })
  @Delete(':slug/favorite')
  async unFavorite(@UserDecorator('id') userId: number, @Param('slug') slug) {
    return await this.articleService.unFavorite(userId, slug);
  }
}
