import {Body, Controller, Post} from '@nestjs/common'
import {CompanyService} from './company.service'
import {ApiOperation, ApiResponse} from '@nestjs/swagger'
import {CreateCompanyDto} from './dto/CreateCompanyDto'

@Controller('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService
  ) {}

  @ApiOperation({summary: '언론사 생성'})
  @ApiResponse({status: 201, description: '언론서 생성 성공'})
  @Post()
  async createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    return await this.companyService.createCompany(createCompanyDto)
  }
}