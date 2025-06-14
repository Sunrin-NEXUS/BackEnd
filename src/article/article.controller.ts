import {Body, Controller, Post} from '@nestjs/common'
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
}