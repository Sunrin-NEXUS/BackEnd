import {Body, Controller, Post, Get, Param} from '@nestjs/common'
import {CompanyService} from './company.service'
import {ApiOperation, ApiParam, ApiResponse} from '@nestjs/swagger'
import {CreateCompanyDto} from './dto/CreateCompanyDto'
import { CompanyResponseDto } from './dto/CompanyResponseDto';

@Controller('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService
  ) {}

  @ApiOperation({summary: '언론사 생성'})
  @ApiResponse({
    status: 201,
    description: '언론서 생성 성공',
    type: CreateCompanyDto
  })
  @Post()
  async createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    return await this.companyService.createCompany(createCompanyDto)
  }

  @ApiOperation({ summary: '언론사 정보 조회' })
  @ApiResponse({
    status: 200,
    description: '언론사 정보 조회 성공',
    type: CompanyResponseDto,
  })
  @ApiParam({
    name: 'name',
    type: String,
    required: true,
    description: '조회할 언론사의 이름',
    example: '조선일보',
  })
  @Get('info/:name')
  async getCompany(@Param('name') name: string) {
    return await this.companyService.getCompanyInfoByName(name);
  }

  @Get('categories/:name')
  @ApiOperation({ summary: '언론사 카테고리 조회' })
  @ApiResponse({ status: 200, description: '언론사 카테고리 조회 성공', type: [String] })
  async getCompanyCategories(@Param('name') name: string): Promise<string[]> {
    return await this.companyService.getCompanyCategories(name);
  }
}
