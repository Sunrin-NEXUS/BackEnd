import {Injectable, BadRequestException} from '@nestjs/common'
import {PrismaService} from '../prisma/prisma.service'
import {CreateArticleDto} from './dto/CreateArticleDto'
import {instanceToPlain} from 'class-transformer'

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
      isHeadline,
      companyId,
      originalUrl
    }: CreateArticleDto
  ) {
    const isExistCompany = !!await this.prismaService.company.findUnique({where: {uuid: companyId}})
    if(!isExistCompany)
      throw new BadRequestException({message: 'companyId not exist'})

    const plainContents = instanceToPlain(contents)

    return await this.prismaService.article.create({
      data: {
        category,
        title,
        contents: plainContents,
        summaryTitle: summary.title,
        summaryContents: summary.contents,
        summaryMediaType: summary.media.mediaType,
        summaryMediaUrl: summary.media.url,
        createAt: createdAt,
        isHeadline,
        companyId,
        originalUrl,
      }
    })
  }

  async findArticleByCategory(category: string) {
    return await this.prismaService.article.findMany({
      where: {
        category,
      }
    })
  }

  async getCategories() {
    return (await this.prismaService.article.findMany({
      where: {category: {not: null}},
      select: {category: true},
      distinct: ['category'],
    })).map((v) => v.category)
  }
}