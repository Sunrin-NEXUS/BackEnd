import {
  Body,
  Param,
  Query,
  Controller,
  Post,
  Get,
} from '@nestjs/common'
import {ApiOperation, ApiResponse, ApiQuery, ApiTags, ApiParam} from '@nestjs/swagger'
import {ArticleService} from './article.service'
import {CreateArticleDto} from './dto/CreateArticleDto'
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { ArticleResponseDto, PaginatedArticleResponseDto } from './dto/ArticleResponseDto';

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
    type: ArticleResponseDto
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
    type: PaginatedArticleResponseDto
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10
  })
  @Get(':category')
  async findArticleByCategory(
    @Param('category') category: string,
    @Pagination() pagination: PaginationDto
  ){
    return await this.articleService.findArticleByCategory(category, pagination)
  }
}