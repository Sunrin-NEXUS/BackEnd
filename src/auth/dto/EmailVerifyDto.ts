import {ApiProperty} from '@nestjs/swagger'
import {IsString} from 'class-validator'
import {EmailVerifyRequestDto} from './EmailVerifyRequestDto'

export class EmailVerifyDto extends EmailVerifyRequestDto {
  @ApiProperty({
    type: String,
    description: '이메일 인증 코드',
    example: '1234',
    default: '1234',
  })
  @IsString()
  code: string
}