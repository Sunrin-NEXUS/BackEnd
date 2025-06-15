import {
  Body,
  Param,
  Controller,
  Post,
  Get,
} from '@nestjs/common'
import {ApiOperation, ApiResponse} from '@nestjs/swagger'
import {ArticleService} from './article.service'
import {CreateArticleDto} from './dto/CreateArticleDto'

@Controller('article')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService
  ) {}

  @ApiOperation({summary: '뉴스 생성'})
  @ApiResponse({status: 201, description: '뉴스 생성 성공'})
  @Post()
  async createArticle(@Body() createArticleDto: CreateArticleDto) {
    return await this.articleService.createArticle(createArticleDto)
  }

  @ApiOperation({summary: '등록된 모든 카테고리 조회'})
  @ApiResponse({status: 200, description: '조회 성공'})
  @Get('/categories')
  async getCategories() {
    return await this.articleService.getCategories()
  }

  @ApiOperation({summary: '지정 카테고리인 뉴스 조회'})
  @ApiResponse({status: 200, description: '조회 성공'})
  @Get(':category')
  async findArticleByCategory(
    @Param('category') category: string
  ){
    return await this.articleService.findArticleByCategory(category)
  }
}