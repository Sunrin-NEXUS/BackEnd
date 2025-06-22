import {BadRequestException} from '@nestjs/common'
import {
  IsArray,
  IsString,
  IsOptional,
  ValidateNested,
  IsDate,
  IsEnum,
  IsUrl, ValidatorConstraint, ValidatorConstraintInterface,
  IsBoolean,
} from 'class-validator'
import {ClassConstructor, plainToInstance, Transform, Type} from 'class-transformer'
import {
  ApiProperty,
  ApiPropertyOptional,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger'
import { MediaDto } from 'src/common/dto/mediaDto'

/**
 * BaseContent – 모든 콘텐츠 타입이 공통으로 가지는 필드
 */

@ValidatorConstraint({ name: 'InvalidTypeConstraint', async: false })
class InvalidTypeConstraint implements ValidatorConstraintInterface {
  validate(): boolean {
    return false
  }

  defaultMessage(): string {
    return 'Invalid or missing type. Could not resolve to a known content type.'
  }
}

export abstract class BaseContent {
  // @Validate(InvalidTypeConstraint)
  // _invalid?: never

  type: string
}

/**
 * SubjectContent
 */
export class Subject extends BaseContent {
  @ApiProperty({ enum: ['subject'] })
  type: 'subject'='subject'

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id?: string

  @ApiProperty()
  @IsString()
  content: string
}

/**
 * DescriptionContent
 */
export class Description extends BaseContent {
  @ApiProperty({ enum: ['description'] })
  type: 'description' = 'description'

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id?: string

  @ApiProperty()
  @IsString()
  content: string
}

/**
 * ListContent
 */
export class ListItem {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id?: string

  @ApiProperty()
  @IsString()
  content: string
}

export class List extends BaseContent {
  @ApiProperty({ enum: ['list'] })
  type: 'list' = 'list'

  @ApiProperty({ type: [ListItem] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ListItem)
  contents: ListItem[]
}

/**
* Footnote
*/
export class Footnote extends BaseContent {
  @ApiProperty({ enum: ['footnote'] })
  type: 'footnote' = 'footnote'

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id?: string

  @ApiProperty()
  @IsString()
  content: string
}

/**
 * LinkContent
 */
export class Link extends BaseContent {
  @ApiProperty({ enum: ['link'] })
  type: 'link' = 'link'

  @ApiProperty()
  @IsString()
  content: string

  @ApiProperty()
  @IsString()
  to: string
}

/**
 * ScrollContent
 */
export class Scroll extends BaseContent {
  @ApiProperty({ enum: ['scroll'] })
  type: 'scroll' = 'scroll'

  @ApiProperty()
  @IsString()
  content: string

  @ApiProperty()
  @IsString()
  to: string
}

/**
 * MediaContent
 */
export class MediaContent extends BaseContent {
  @ApiProperty({ enum: ['media'] })
  type: 'media' = 'media'

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

/**
 * Summary DTO
 */
export class SummaryDto {
  @ApiProperty()
  @IsString()
  title: string

  @ApiProperty()
  @IsString()
  contents: string

  @ApiProperty({ type: MediaDto })
  @ValidateNested()
  @Type(() => MediaDto)
  media: MediaDto
}

function resolveContentType(type: string) {
  switch (type) {
    case 'subject': return Subject
    case 'description': return Description
    case 'list': return List
    case 'link': return Link
    case 'scroll': return Scroll
    case 'media': return MediaContent
    case 'footnote': return Footnote
    case '':
      throw new BadRequestException({
        message: 'Invalid content type. The "type" field must not be empty and must be one of: subject, description, footnote, list, link, scroll, media.'
      })
    default:
      throw new BadRequestException({
        message: 'Invalid content type. The "type" field must be one of: subject, description, footnote, list, link, scroll, media.'
      })
  }
}

// 👉 Swagger 문서화용 모델 등록
@ApiExtraModels(
  Subject,
  Description,
  Footnote,
  List,
  Link,
  Scroll,
  MediaContent,
)
export class CreateArticleDto {
  @ApiProperty()
  @IsString()
  category: string

  @ApiProperty()
  @IsString()
  title: string

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(Subject) },
      { $ref: getSchemaPath(Description) },
      { $ref: getSchemaPath(Footnote) },
      { $ref: getSchemaPath(List) },
      { $ref: getSchemaPath(Link) },
      { $ref: getSchemaPath(Scroll) },
      { $ref: getSchemaPath(MediaContent) },
    ],
    discriminator: {
      propertyName: 'type',
      mapping: {
        subject: getSchemaPath(Subject),
        description: getSchemaPath(Description),
        footnote: getSchemaPath(Footnote),
        list: getSchemaPath(List),
        link: getSchemaPath(Link),
        scroll: getSchemaPath(Scroll),
        media: getSchemaPath(MediaContent),
      },
    },
    type: 'array',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Transform(({ value }) => {
    if (!Array.isArray(value)) return []
    return value.map((item) => {
      const TargetClass = resolveContentType(item.type)
      return plainToInstance(TargetClass as ClassConstructor<BaseContent>, item)
    })
  })
  contents: Array<
    | Subject
    | Description
    | Footnote
    | List
    | Link
    | Scroll
    | MediaContent
  >

  @ApiProperty({ type: SummaryDto })
  @ValidateNested()
  @Type(() => SummaryDto)
  summary: SummaryDto

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  createdAt: Date

  @ApiProperty()
  @IsBoolean()
  isHeadline: boolean

  @ApiProperty()
  @IsString()
  companyId: string

  @ApiProperty({default: 'https://example.com'})
  @IsUrl()
  originalUrl: string
}