import {ApiProperty} from '@nestjs/swagger'
import {IsString, IsUrl} from 'class-validator'

export class CreateCompanyDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsString()
  description: string

  @ApiProperty()
  @IsUrl()
  profileImageUrl: string
}
