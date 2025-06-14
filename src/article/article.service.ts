import {Injectable} from '@nestjs/common'
import {PrismaService} from '../prisma/prisma.service'
import {CreateArticleDto} from './dto/CreateArticleDto'

@Injectable()
export class ArticleService {
  constructor(
    private readonly prismaService: PrismaService
  ) {}

  async createArticle(
    {
      category,
      title,
      contents,
      summary,
      createdAt,
      companyId,
      originalUrl
    }: CreateArticleDto
  ) {
    return await this.prismaService.article.create({
      data: {
        category,
        title,
        contents: JSON.stringify(contents),
        summaryTitle: summary.title,
        summaryContents: summary.contents,
        summaryMediaType: summary.media.mediaType,
        summaryMediaUrl: summary.media.url,
        createAt: createdAt,
        companyId,
        originalUrl,
      }
    })
  }
}