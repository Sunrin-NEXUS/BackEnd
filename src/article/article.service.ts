import {Injectable, BadRequestException, Query} from '@nestjs/common'
import {PrismaService} from '../prisma/prisma.service'
import {CreateArticleDto} from './dto/CreateArticleDto'
import {instanceToPlain} from 'class-transformer'
import { PaginationDto } from '../common/dto/pagination.dto'
import { PaginatedArticleResponseDto } from './dto/ArticleResponseDto'

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

  async findArticleByCategory(
    category: string,
    pagination: PaginationDto
  ): Promise<PaginatedArticleResponseDto> {
    const { page = 1, limit = 10 } = pagination;
    
    const [items, total] = await Promise.all([
      this.prismaService.article.findMany({
        where: {
          category,
        },
        take: limit,
        skip: (page - 1) * limit,
        orderBy: {
          createAt: 'desc'
        }
      }),
      this.prismaService.article.count({
        where: {
          category,
        }
      })
    ]);

    return {
      items: items.map(v => ({
        ...v,
        contents: v.summaryContents,
        ...(v.summaryMediaUrl && v.summaryMediaType && {
          media: {
            mediaType: v.summaryMediaType,
            url: v.summaryMediaUrl,
          }
        })
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getCategories() {
    return (await this.prismaService.article.findMany({
      where: {category: {not: null}},
      select: {category: true},
      distinct: ['category'],
    })).map((v) => v.category)
  }
}