import { ApiProperty } from '@nestjs/swagger'
import { CompanySummaryResponseDto } from '../../company/dto/CompanySummaryResponseDto'
import { ArticleSummaryResponseDto } from './ArticleSummaryResponseDto'

export class ArticlePressResponseDto {
  @ApiProperty({ type: () => CompanySummaryResponseDto })
  company: CompanySummaryResponseDto

  @ApiProperty({ type: () => [ArticleSummaryResponseDto] })
  headlines: ArticleSummaryResponseDto[]

  @ApiProperty({ type: () => [ArticleSummaryResponseDto] })
  normals: ArticleSummaryResponseDto[]
}

export class ArticleAllPressResponseDto {
  @ApiProperty({ type: () => [ArticlePressResponseDto] })
  items: ArticlePressResponseDto[]
}
