import {MailerService} from '@nestjs-modules/mailer'
import {
  BadRequestException, ForbiddenException,
  Injectable,
  InternalServerErrorException,
  RequestTimeoutException,
  UnauthorizedException
} from '@nestjs/common';
import {ConfigService} from '@nestjs/config'
import { PrismaService } from '../prisma/prisma.service'
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {EmailVerifyDto} from './dto/EmailVerifyDto'
import {EmailVerifyRequestDto} from './dto/EmailVerifyRequestDto'
import {SignInDto} from './dto/SignInDto'
import {SignUpDto} from './dto/SignUpDto'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly mailService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async emailVerifyRequest({email}: EmailVerifyRequestDto) {
    const targetVerificationData = await this.prismaService.emailVerification.findUnique({where: {email}})
    const targetEmailUser = await this.prismaService.user.findUnique({where: {email}})
    const code = Math.floor(Math.random() * 10000).toString().padStart(4, '0')

    if(!targetVerificationData) {
      await this.prismaService.emailVerification.create({
        data: {
          email,
          code,
        }
      })
    } else {
      if(targetEmailUser) {
        throw new BadRequestException({message: 'Email is already registered.'})
      }
      await this.prismaService.emailVerification.update({
        where: {email},
        data: {code}
      })
    }

    try {
      await this.mailService.sendMail({
        to: email,
        from: this.configService.get<string>('MAIL_USER'),
        subject: 'Nexus Email Verification Code',
        template: 'emailTemplate',
        context: {
          code: code.split('')
        }
      })
    } catch (error) {
      throw new InternalServerErrorException({
        status: 'error',
        message: 'Failed to send verification email.',
        errorMessage: error
      })
    }

    return {
      status: 'success',
      message: 'Verification code has been sent to your email.',
    }
  }

  async emailVerify(
    {email, code}: EmailVerifyDto,
    requestedAt: Date
  ) {
    const targetVerificationData = await this.prismaService.emailVerification.findUnique({where: {email}})

    if(!targetVerificationData)
      throw new BadRequestException({message: 'Verification code has not been sent to this email.'})
    if(requestedAt.getTime() - targetVerificationData.updateAt.getTime() > 5 * 60 * 1000)
      throw new RequestTimeoutException({message: 'Verification code has expired.'})
    if(targetVerificationData.code !== code)
      throw new BadRequestException({message: 'Invalid verification code.'})

    await this.prismaService.emailVerification.update({
      where: {email},
      data: {isVerified: true},
    })

    return {
      status: 'success',
      message: 'Email successfully verified.'
    }
  }

  async signUp({id, email, password}: SignUpDto) {
    const isVerified = (await this.prismaService.emailVerification.findUnique({where: {email}}))?.isVerified
    if(!isVerified)
      throw new ForbiddenException({message: 'Email has not been verified.'})
    const isExist = !!await this.prismaService.user.findUnique({where: {email}})
    if(isExist)
      throw new BadRequestException({message: 'User already exists.'})

    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt)

    await this.prismaService.user.create({
      data: {
        id,
        email,
        password: hashedPassword,
      }
    })

    await this.prismaService.emailVerification.delete({where: {email}})

    return {
      status: 'success',
      message: 'User has been created successfully.',
    }
  }

  async signIn({email, password}: SignInDto) {
    const userData = await this.prismaService.user.findUnique({where: {email}})

    if(!userData)
      throw new UnauthorizedException({message: 'User not found.'})
    const isCorrectPassword = await bcrypt.compare(password, userData.password)
    if(!isCorrectPassword)
      throw new UnauthorizedException({message: 'Incorrect password.'})

    const refreshToken = this.jwtService.sign(
      {sub: userData.uuid},
      {
        secret: this.configService.get<string>('SECRET_REFRESH_JWT'),
        expiresIn: '7d',
      }
    )

    const accessToken = await this.refresh(refreshToken)

    return {
      accessToken,
      refreshToken
    }
  }

  async refresh(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken, {
      secret: this.configService.get<string>('SECRET_REFRESH_JWT'),
    })

    const targetUser = await this.prismaService.user.findUnique({
      where: {uuid: payload.sub}
    })
    if(!targetUser)
      throw new UnauthorizedException({message: 'Invalid refresh token.'})

    return this.jwtService.sign(
      {sub: targetUser.uuid},
      {
        secret: this.configService.get<string>('SECRET_ACCESS_JWT'),
        expiresIn: '1h',
      }
    )
  }
}
