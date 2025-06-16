import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @ApiPropertyOptional({
    description: '페이지 번호',
    example: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: '한 페이지에 표시할 항목 수',
    example: 10,
    default: 10,
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(1)
  limit?: number = 10;
} 