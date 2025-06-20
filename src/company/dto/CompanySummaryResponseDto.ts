import {ApiProperty} from '@nestjs/swagger'

export class CompanySummaryResponseDto {
  @ApiProperty()
  uuid: string

  @ApiProperty()
  profileImageUrl: string

  @ApiProperty()
  name: string
}