import {ApiProperty} from '@nestjs/swagger'

export class CompanySummaryResponseDto {
  @ApiProperty()
  profileImageUrl: string

  @ApiProperty()
  name: string
}