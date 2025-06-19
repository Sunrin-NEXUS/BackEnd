import { ApiProperty } from '@nestjs/swagger';

export class CompanySubscriberCountResponseDto {
  @ApiProperty({
    description: '언론사의 구독자 수',
    example: 12345,
  })
  subscriberCount: number;
}
