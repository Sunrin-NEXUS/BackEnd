import { ApiProperty } from '@nestjs/swagger'
import { CompanySummaryResponseDto } from '../../company/dto/CompanySummaryResponseDto'

export class SubscribedCompaniesResponseDto {
  @ApiProperty({
    type: () => [CompanySummaryResponseDto],
    description: '사용자가 구독한 언론사 목록',
  })
  items: CompanySummaryResponseDto[]
}
