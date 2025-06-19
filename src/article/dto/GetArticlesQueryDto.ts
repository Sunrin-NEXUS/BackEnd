import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsIn, IsOptional, IsString } from 'class-validator'

export class GetArticlesQueryDto {
  @ApiPropertyOptional({
    description: '기사 유형',
    enum: ['headline', 'normal'],
    example: 'headline',
  })
  @IsOptional()
  @IsIn(['headline', 'normal'])
  type?: 'headline' | 'normal'

  @ApiPropertyOptional({
    description: '기사 카테고리',
    type: String,
    example: 'sports',
  })
  @IsOptional()
  @IsString()
  category?: string
}
