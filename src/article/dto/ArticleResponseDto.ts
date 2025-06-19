import {ApiProperty} from '@nestjs/swagger'
import {CompanySummaryResponseDto} from '../../company/dto/CompanySummaryResponseDto'
import {
  Subject,
  Description,
  List,
  Link,
  Scroll,
  MediaContent
} from './CreateArticleDto'

export class ArticleResponseDto {
  @ApiProperty({
    description: '뉴스 ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  uuid: string;

  @ApiProperty({
    description: '뉴스 제목',
    example: '주요 뉴스 제목'
  })
  title: string;

  @ApiProperty({
    description: '뉴스 내용',
    example: '[{type: "subject", content: "뉴스 내용"}]'
  })
  contents: Array<
    | Subject
    | Description
    | List
    | Link
    | Scroll
    | MediaContent
  >

  @ApiProperty({
    description: '생성일',
    example: '2024-03-20T00:00:00.000Z'
  })
  createAt: Date;

  @ApiProperty({
    default: 'https://example.com',
    example: 'https://example.com',
  })
  originalUrl: string;

  @ApiProperty({
    description: '언론사',
    type: CompanySummaryResponseDto,
  })
  company: CompanySummaryResponseDto;
}