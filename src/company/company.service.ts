import {BadRequestException, Injectable} from '@nestjs/common'
import {Company} from '@prisma/client'
import {PrismaService} from '../prisma/prisma.service'
import {CompanySubscriberCountResponseDto} from './dto/CompanySubscriberCountResponseDto'
import {CreateCompanyDto} from './dto/CreateCompanyDto'

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
}