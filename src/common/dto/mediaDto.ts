import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsString, IsOptional, IsEnum } from "class-validator"

export class MediaDto {
  @ApiProperty({ enum: ['video', 'image'] })
  @IsEnum(['video', 'image'])
  mediaType: 'video' | 'image'

  @ApiProperty()
  @IsString()
  url: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string
}