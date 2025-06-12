import {ApiProperty} from '@nestjs/swagger'
import {IsString} from 'class-validator'
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