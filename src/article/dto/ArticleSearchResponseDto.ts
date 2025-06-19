import { MediaDto } from "./ArticleSummaryResponseDto"
import { ApiProperty } from '@nestjs/swagger'

export class ArticleSearch {
  @ApiProperty({ description: '뉴스 UUID', example: '7f41e977-f00d-40fb-a99f-388176c36bbf' })
  uuid: string
  @ApiProperty({ description: '뉴스 제목', example: '오늘의 주요 뉴스' })
  title: string
  @ApiProperty({ description: '뉴스 요약 내용', example: '이것은 뉴스의 요약입니다.' })
  contents: string
  @ApiProperty({ description: '미디어 정보', type: MediaDto, required: false })
  media?: MediaDto
}

export class ArticleSearchResponseDto {
  @ApiProperty({ type: [ArticleSearch], description: '검색된 뉴스 목록' })
  items: Array<ArticleSearch>
}