import {Injectable, UnauthorizedException} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {PassportStrategy} from '@nestjs/passport'
import {ExtractJwt, Strategy} from 'passport-jwt'
import {PrismaService} from '../../prisma/prisma.service'

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return req?.cookie?.accessToken
        }
      ]),
      secretOrKey: configService.get<string>('SECRET_ACCESS_JWT') || 'fallbackSecret'
    })
  }
  async validate(payload: any) {
    const user = this.prismaService.user.findUnique({where: {uuid: payload.sub}})
    if(!user)
      throw new UnauthorizedException('user not found')
    return user
  }
}