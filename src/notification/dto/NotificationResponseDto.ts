import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { MediaDto } from '../../common/dto/mediaDto'
import { CompanySummaryResponseDto } from '../../company/dto/CompanySummaryResponseDto'

class Notification {
  @ApiProperty({ example: '속보! 태풍 북상' })
  title: string

  @ApiProperty({ example: '이번 주말 태풍이 한반도에 상륙할 예정입니다.' })
  contents: string

  @ApiPropertyOptional({ type: () => MediaDto })
  media?: MediaDto

  @ApiProperty({ type: () => CompanySummaryResponseDto })
  company: CompanySummaryResponseDto
}

export class NotificationResponseDto {
  @ApiProperty({ type: () => [Notification] })
  items: Notification[]
}
