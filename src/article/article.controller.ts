import {
  Body,
  Param,
  Controller,
  Post,
  Get, Query,
} from '@nestjs/common'
import {ApiOperation, ApiResponse, ApiQuery, ApiTags, ApiParam} from '@nestjs/swagger'
import {ArticleService} from './article.service'
import {CreateArticleDto} from './dto/CreateArticleDto'
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ArticleResponseSummaryDto, PaginatedArticleResponseSummaryDto } from './dto/ArticleResponseSummaryDto';
import {ArticleResponseDto} from './dto/ArticleResponseDto';
import {GetArticlesQueryDto} from './dto/GetArticlesQueryDto'

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
    type: ArticleResponseSummaryDto
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
    summary: '지정 카테고리인 뉴스 조회',
    description: '특정 카테고리의 뉴스를 페이지네이션과 함께 조회합니다.'
  })
  @ApiParam({
    name: 'category',
    description: '조회할 뉴스 카테고리',
    example: 'politics'
  })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    type: PaginatedArticleResponseSummaryDto
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10
  })
  @Get('category/:category')
  async findArticleByCategory(
    @Param('category') category: string,
    @Query() pagination: PaginationDto
  ){
    return await this.articleService.findArticleByCategory(category, pagination)
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