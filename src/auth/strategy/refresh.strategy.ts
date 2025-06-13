import {Injectable, UnauthorizedException} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {PassportStrategy} from '@nestjs/passport'
import {ExtractJwt, Strategy} from 'passport-jwt'
import {PrismaService} from '../../prisma/prisma.service'

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return req?.cookie?.refreshToken
        }
      ]),
      secretOrKey: configService.get<string>('SECRET_REFRESH_JWT') || 'fallbackSecret',
    })
  }
  async validate(payload: any) {
    const user = this.prismaService.user.findUnique({where: {uuid: payload.sub}})
    if(!user)
      throw new UnauthorizedException('user not found')
    return user
  }
}