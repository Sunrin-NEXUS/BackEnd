import {Injectable} from '@nestjs/common'
import {PrismaService} from '../prisma/prisma.service'
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
}