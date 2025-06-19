import {ApiProperty} from '@nestjs/swagger'
import {CompanySummaryResponseDto} from './CompanySummaryResponseDto'

export class CompanyResponseDto extends CompanySummaryResponseDto {
  @ApiProperty()
  description: string

  @ApiProperty()
  subscribers: number
}