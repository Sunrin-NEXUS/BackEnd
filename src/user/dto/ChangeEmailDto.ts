import {ApiProperty} from '@nestjs/swagger'
import {IsEmail} from 'class-validator'

export class ChangeEmailDto {
  @ApiProperty({
    type: String,
    description: '기존 이메일',
    example: 'email@email.com',
    default: 'email@email.com',
  })
  @IsEmail()
  originalEmail: string

  @ApiProperty({
    type: String,
    description: '변경할 이메일',
    example: 'email@email.com',
    default: 'email@email.com',
  })
  @IsEmail()
  newEmail: string
}