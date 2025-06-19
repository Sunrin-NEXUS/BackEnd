import { ApiProperty } from '@nestjs/swagger';

export class MediaDto {
  @ApiProperty({
    description: '미디어 타입',
    example: 'image'
  })
  mediaType: string;

  @ApiProperty({
    description: '미디어 URL',
    example: 'https://example.com/image.jpg'
  })
  url: string;
}

export class ArticleResponseSummaryDto {
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
    example: '뉴스 상세 내용...'
  })
  contents: string;

  @ApiProperty({
    description: '뉴스 카테고리',
    example: 'politics',
    nullable: true
  })
  category: string | null;

  @ApiProperty({
    description: '생성일',
    example: '2024-03-20T00:00:00.000Z'
  })
  createAt: Date;

  @ApiProperty({
    description: '미디어 정보',
    type: MediaDto,
    required: false
  })
  media?: MediaDto;


  @ApiProperty({
    description: '헤드라인 여부',
    type: Boolean,
  })
  isHeadline?: boolean;
}

export class PaginatedArticleResponseSummaryDto {
  @ApiProperty({
    description: '뉴스 목록',
    type: [ArticleResponseSummaryDto]
  })
  items: ArticleResponseSummaryDto[];

  @ApiProperty({
    description: '전체 뉴스 개수',
    example: 100
  })
  total: number;

  @ApiProperty({
    description: '현재 페이지',
    example: 1
  })
  page: number;

  @ApiProperty({
    description: '페이지당 항목 수',
    example: 10
  })
  limit: number;

  @ApiProperty({
    description: '전체 페이지 수',
    example: 10
  })
  totalPages: number;
} 