import {ApiProperty} from '@nestjs/swagger'
import {IsEmail} from 'class-validator'

export class EmailVerifyRequestDto {
  @ApiProperty({
    type: String,
    description: '이메일',
    example: 'email@email.com',
    default: 'email@email.com',
  })
  @IsEmail()
  email: string
}