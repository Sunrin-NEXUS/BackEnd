import {Body, Controller, Post, Get, Param} from '@nestjs/common'
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

  @ApiOperation({summary: '언론사 정보 조회'})
  @ApiResponse({status: 200, description: '언론사 정보 조회 성공'})
  @Get('Info')
  async getCompany(@Param('name') name: string) {
    return await this. companyService.getCompanyPublicInfo(name)
  }

  @ApiOperation({summary: '언론사 구독자 수 조회'})
  @ApiResponse({status: 200, description: '언론사 구독자 수 조회 성공'})
  @Get('subscribers/count')
  async getSubscriberCount(@Param('name') name: string) {
    return await this.companyService.getCompanySubscriberCount(name);
  }
}