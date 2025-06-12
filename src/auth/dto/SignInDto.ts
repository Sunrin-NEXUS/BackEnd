import {ApiProperty} from '@nestjs/swagger'
import {IsEmail, IsStrongPassword} from 'class-validator'

export class SignInDto {
  @ApiProperty({
    type: String,
    description: '이메일',
    example: 'email@email.com',
    default: 'email@email.com',
  })
  @IsEmail()
  email: string

  @ApiProperty({
    type: String,
    description: '비밀번호',
    example: 'password1234',
    default: 'password1234',
  })
  @IsStrongPassword({
    minLength: 8,
    minUppercase: 0,
    minSymbols: 0,
  })
  password: string
}