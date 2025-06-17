import {Body, Controller, Post, HttpCode, HttpStatus, Req, Res} from '@nestjs/common';
import {ConfigService} from '@nestjs/config'
import {Response as expRes} from 'express'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { AuthService } from './auth.service';
import {EmailVerifyDto} from './dto/EmailVerifyDto'
import {EmailVerifyRequestDto} from './dto/EmailVerifyRequestDto'
import {SignInDto} from './dto/SignInDto'
import {SignUpDto} from './dto/SignUpDto'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({summary: '이메일 인증 요청'})
  @ApiResponse({status: 200, description: '이메일 인증 요청 성공'})
  @HttpCode(HttpStatus.OK)
  @Post('/email/verify/request')
  async emailVerifyRequest(@Body() emailRequestDto: EmailVerifyRequestDto) {
    return await this.authService.emailVerifyRequest(emailRequestDto)
  }

  @ApiOperation({summary: '이메일 인증'})
  @ApiResponse({status: 200, description: '이메일 인증 성공'})
  @HttpCode(HttpStatus.OK)
  @Post('/email/verify')
  async emailVerify(
    @Body() emailVerifyDto: EmailVerifyDto,
    @Req() req: Request
  ) {
    const requestedAt = req.headers['date'] ? new Date(req.headers['date']) : new Date()

    return await this.authService.emailVerify(emailVerifyDto, requestedAt)
  }

  @ApiOperation({summary: '회원가입'})
  @ApiResponse({status: 201, description: '회원가입 성공'})
  @HttpCode(HttpStatus.CREATED)
  @Post('/sign/up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.authService.signUp(signUpDto)
  }

  @ApiOperation({summary: '로그인'})
  @ApiResponse({status: 200, description: '로그인 성공'})
  @HttpCode(HttpStatus.OK)
  @Post('/sign/in')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({passthrough: true}) res: expRes
  ) {
    const {
      accessToken,
      refreshToken,
    } = await this.authService.signIn(signInDto)

    res.cookie('accessToken', accessToken,{
      httpOnly: true,
      secure: this.configService.get<boolean>('IS_PRODUCTION'),
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
    })
    res.cookie('refreshToken', refreshToken,{
      httpOnly: true,
      secure: this.configService.get<boolean>('IS_PRODUCTION'),
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return {
      status: 'success',
      message: 'Successfully signed in',
      data: {accessToken, refreshToken},
    }
  }
}
