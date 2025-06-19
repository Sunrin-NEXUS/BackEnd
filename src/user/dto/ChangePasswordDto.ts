import {ApiProperty} from '@nestjs/swagger'
import {IsStrongPassword} from 'class-validator'

export class ChangePasswordDto{

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
  originalPassword: string

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
  newPassword: string
}