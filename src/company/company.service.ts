import {BadRequestException, Injectable} from '@nestjs/common'
import {Company} from '@prisma/client'
import {PrismaService} from '../prisma/prisma.service'
import {CompanySubscriberCountResponseDto} from './dto/CompanySubscriberCountResponseDto'
import {CreateCompanyDto} from './dto/CreateCompanyDto'
import { CompanyResponseDto } from './dto/CompanyResponseDto'

@Injectable()
export class CompanyService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  async createCompany({
    name,
    description,
    profileImageUrl,
  }: CreateCompanyDto) {
    return await this.prismaService.company.create({
      data: {
        name,
        description,
        profileImageUrl,
      }
    })
  }

  async getCompanyInfoByName(name: string): Promise<CompanyResponseDto> {
    const company = await this.getCompanyByName(name)
    const subscriberCnt = await this.getCompanySubscriberCount(name)
    return {
      uuid: company.uuid,
      name: company.name,
      profileImageUrl: company.profileImageUrl,
      description: company.description,
      subscribers: subscriberCnt.subscriberCount,
    }
  }

  async getCompanyByName(name: string): Promise<Company> {
    const company = await this.prismaService.company.findFirst({
      where: {name}
    })
    if(!company)
      throw new BadRequestException({message: "Company does not exist"})

    return company
  }

  async getCompanySubscriberCount(name: string): Promise<CompanySubscriberCountResponseDto> {
    const company = await this.prismaService.company.findUnique({
      where: {name},
      include: {
        _count: {
          select: {
            subscribers: true
          }
        }
      }
    })
    if(!company) {
      throw new BadRequestException({message: 'Company does Not exist'})
    }

    return { subscriberCount: company._count.subscribers };
  }

  async getCompanyCategories(name: string): Promise<string[]> {
    const company = await this.prismaService.company.findUnique({
      where: {name},
      include: {
        articles: {
          where: {
            category: {not: null}
          },
          select:{
            category: true
          }
        }
      }
    })
    if (!company)
      throw new BadRequestException({message: 'Company Not Found'})

    const categoryset = new Set<string>()
    for (const article of company.articles) {
      if (article.category)
        categoryset.add(article.category)
    }
    return [...categoryset]
  }
}
