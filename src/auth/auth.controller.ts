
import { Body, Controller, Post, HttpCode, HttpStatus, UnprocessableEntityException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    const {id, password} = signInDto;
    const user = await this.userService.findOne(id)
    this.authService.setRefreshToken({user})
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Post('register')
  async register(@Body() registerDto: Record<string, any>) {
    return await this.userService.register(registerDto.username, registerDto.password)
  }
}
