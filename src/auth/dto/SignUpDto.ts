import {ApiProperty} from '@nestjs/swagger'
import {IsEmail, IsString, IsStrongPassword} from 'class-validator'
import {SignInDto} from './SignInDto'

export class SignUpDto extends SignInDto {
  @ApiProperty({
    type: String,
    description: '아이디',
    example: 'user',
    default: 'user',
  })
  @IsString()
  id: string
}