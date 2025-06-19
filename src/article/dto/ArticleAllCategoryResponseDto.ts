import { ApiProperty } from '@nestjs/swagger';
import { ArticleSummaryResponseDto } from './ArticleSummaryResponseDto';

export class ArticleSummaryResponseDtoWithHeadline extends ArticleSummaryResponseDto {
  @ApiProperty({ description: '헤드라인 여부', type: Boolean })
  declare isHeadline: boolean;
}

export class ArticleAllCategoryResponseDto {
  @ApiProperty({ type: [ArticleSummaryResponseDtoWithHeadline] })
  items: ArticleSummaryResponseDtoWithHeadline[];
}