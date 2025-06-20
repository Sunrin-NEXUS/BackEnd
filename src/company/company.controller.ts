import {Body, Controller, Post, Get, Param} from '@nestjs/common'
import {CompanyService} from './company.service'
import {ApiOperation, ApiParam, ApiResponse} from '@nestjs/swagger'
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

  @ApiOperation({ summary: '언론사 정보 조회' })
  @ApiResponse({ status: 200, description: '언론사 정보 조회 성공' })
  @ApiParam({
    name: 'name',
    type: String,
    required: true,
    description: '조회할 언론사의 이름',
    example: '조선일보',
  })
  @Get('info/:name')
  async getCompany(@Param('name') name: string) {
    return await this.companyService.getCompanyByName(name);
  }

  @ApiOperation({summary: '언론사 구독자 수 조회'})
  @ApiResponse({status: 200, description: '언론사 구독자 수 조회 성공'})
  @ApiParam({
    name: 'name',
    type: String,
    required: true,
    description: '조회할 언론사의 이름',
    example: '조선일보',
  })
  @Get('subscribers/count/:name')
  async getSubscriberCount(@Param('name') name: string) {
    return await this.companyService.getCompanySubscriberCount(name);
  }

  @Get('categories/:name')
  @ApiOperation({ summary: '언론사 카테고리 조회' })
  @ApiResponse({ status: 200, description: '언론사 카테고리 조회 성공', type: [String] })
  async getCompanyCategories(@Param('name') name: string): Promise<string[]> {
    return await this.companyService.getCompanyCategories(name);
  }

  @ApiOperation({ summary: '언론사별 기사 조회' })
  @ApiParam({
    name: 'name',
    type: String,
    description: '언론사 이름',
    example: '조선일보'
  })
  @ApiResponse({
    status: 200,
    description: '기사 조회 성공',
    schema: {
      example: {
        headlines: [
          {
            uuid: '7a1e4567-e89b-12d3-a456-426614174000',
            title: '속보: 대형 태풍 상륙',
            isHeadline: true
          },
          {
            uuid: '8b2e4567-e89b-12d3-a456-426614174001',
            title: '단독: 유명 인사 인터뷰',
            isHeadline: true
          }
        ],
        normalArticles: [
          {
            uuid: '9c3e4567-e89b-12d3-a456-426614174002',
            title: '정책 분석: 부동산 개편',
            isHeadline: false
          }
        ]
      }
    }
  })
  @Get(':name/articles')
  async getCompanyArticles(@Param('name') name: string) {
    return await this.companyService.getCompanyArticles(name);
  }
}