import {
  Body,
  Param,
  Controller,
  Post,
  Get, Query,
} from '@nestjs/common'
import {ApiOperation, ApiResponse, ApiTags, ApiParam} from '@nestjs/swagger'
import {ArticleService} from './article.service'
import {CreateArticleDto} from './dto/CreateArticleDto'
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ArticleSummaryResponseDto, PaginatedArticleResponseSummaryDto } from './dto/ArticleSummaryResponseDto';
import {ArticleResponseDto} from './dto/ArticleResponseDto';
import {GetArticlesQueryDto} from './dto/GetArticlesQueryDto'
import { ArticleAllCategoryResponseDto } from './dto/ArticleAllCategoryResponseDto';

@ApiTags('Article')
@Controller('article')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService
  ) {}

  @ApiOperation({
    summary: '뉴스 생성',
    description: '새로운 뉴스를 생성합니다.'
  })
  @ApiResponse({
    status: 201,
    description: '뉴스 생성 성공',
    type: ArticleSummaryResponseDto
  })
  @Post()
  async createArticle(@Body() createArticleDto: CreateArticleDto) {
    return await this.articleService.createArticle(createArticleDto)
  }

  @ApiOperation({
    summary: '등록된 모든 카테고리 조회',
    description: '시스템에 등록된 모든 뉴스 카테고리를 조회합니다.'
  })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    type: [String]
  })
  @Get('/categories')
  async getCategories() {
    return await this.articleService.getCategories()
  }

  @ApiOperation({
    summary: '모든 카테고리에 대해 제일 최신 헤드라인 조회',
    description: '모든 카테고리에 대해 제일 최신 헤드라인을 조회합니다.'
  })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    type: ArticleAllCategoryResponseDto
  })
  @Get('category/all')
  async findArticleByCategory(){
    return await this.articleService.getArticleAllCategory()
  }

  @ApiOperation({
    summary: '뉴스 상세 조회',
    description: '아이디를 기준으로 상세 뉴스를 조회합니다'
  })
  @ApiParam({
    name: 'uuid',
    description: '조회할 뉴스 uuid',
    example: '7f41e977-f00d-40fb-a99f-388176c36bbf'
  })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    type: ArticleResponseDto
  })
  @Get(':uuid')
  async getArticle(@Param('uuid') uuid: string): Promise<ArticleResponseDto> {
    return this.articleService.findArticleById(uuid)
  }

  @ApiOperation({
    summary: '뉴스 조회',
    description: '뉴스를 조회합니다.'
  })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    type: PaginatedArticleResponseSummaryDto
  })
  @Get()
  async getArticles(
    @Query() articlesQuery: GetArticlesQueryDto,
    @Query() pagination: PaginationDto,
  ): Promise<PaginatedArticleResponseSummaryDto> {
    return await this.articleService.getArticles(articlesQuery, pagination)
  }
}