import {Injectable, BadRequestException, InternalServerErrorException} from '@nestjs/common'
import {PrismaService} from '../prisma/prisma.service'
import {instanceToPlain} from 'class-transformer'
import { PaginationDto } from '../common/dto/pagination.dto'
import { PaginatedArticleResponseSummaryDto } from './dto/ArticleSummaryResponseDto'
import {ArticleResponseDto} from './dto/ArticleResponseDto'
import {
  Subject,
  Description,
  List,
  Link,
  Scroll,
  MediaContent,
  CreateArticleDto
} from './dto/CreateArticleDto'
import {GetArticlesQueryDto} from './dto/GetArticlesQueryDto'
import {ArticleToArticleSummaryResponseDto} from './util/ArticleToArticleSummaryResponseDto'

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
    {page, limit}: PaginationDto
  ): Promise<PaginatedArticleResponseSummaryDto> {
    if(Number.isNaN(page))
      throw new BadRequestException({message: 'page number must be a number'})
    if(Number.isNaN(limit))
      throw new BadRequestException({message: 'limit must be a number'})

    page = Number(page)
    limit = Number(limit)

    const [items, total] = await Promise.all([
      this.prismaService.article.findMany({
        where: {
          category,
        },
        take: limit,
        skip: (page - 1) * limit,
        orderBy: {createAt: 'desc'},
        include: {company: true}
      }),
      this.prismaService.article.count({
        where: {
          category,
        }
      })
    ]);

    return {
      items: items.map(v => ArticleToArticleSummaryResponseDto(v)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getCategories(): Promise<Array<string>> {
    const categories = (await this.prismaService.article.findMany({
      where: {category: {not: null}},
      select: {category: true},
      distinct: ['category'],
    }))
      .map((v) => v.category)
    return categories.filter(v => v !== null)
  }

  async findArticleById(uuid: string): Promise<ArticleResponseDto> {
    const article = await this.prismaService.article.findUnique({
      where: {uuid},
      include: {company: true}
    })

    if(!article)
      throw new BadRequestException({message: 'article not found'})

    let contents = article.contents
    if(typeof contents === 'string')
      contents = JSON.parse(contents)

    if(!Array.isArray(contents))
      throw new InternalServerErrorException({message: 'contents is not an array'})

    if(!(contents.every(v => this.isValidContentItem(v))))
      throw new BadRequestException({message: 'contents must be an typeof Article.contents'})

    return {
      uuid: article.uuid,
      title: article.title,
      contents: contents as unknown as (Subject | Description | List | Link | Scroll | MediaContent)[],
      createAt: article.createAt,
      originalUrl: article.originalUrl,
      company: {
        profileImageUrl: article.company.profileImageUrl,
        name: article.company.name,
      }
    }
  }

  isValidContentItem(item: any): item is Subject | Description | List | Link | Scroll | MediaContent {
    return typeof item === 'object' && item !== null && 'type' in item;
  }

  async getArticles(
    {type, category}: GetArticlesQueryDto,
    {page=1, limit=10}: PaginationDto,
  ): Promise<PaginatedArticleResponseSummaryDto> {
    if(Number.isNaN(page))
      throw new BadRequestException({message: 'page number must be a number'})
    if(Number.isNaN(limit))
      throw new BadRequestException({message: 'limit must be a number'})

    page = Number(page)
    limit = Number(limit)
    try {
      const [items, total] = await Promise.all([
        this.prismaService.article.findMany({
          where: {
            ...(type && {isHeadline: type === 'headline'}),
            ...(category && {category: category}),
          },
          take: limit,
          skip: (page - 1) * limit,
          orderBy: {createAt: 'desc'},
          include: {company: true}
        }),
        this.prismaService.article.count({
          where: {
            ...(type && {isHeadline: type === 'headline'}),
            ...(category && {category: category}),
          },
        })
      ])

      return {
        items: items.map(v => ArticleToArticleSummaryResponseDto(v)),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new InternalServerErrorException({message: error})
    }
  }
}
