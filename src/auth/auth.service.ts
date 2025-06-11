
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  setRefreshToken({ user}) {
    const refreshToken = this.jwtService.sign(
      {
        sub: user.id,
        username: user.username,
      },
      {
        secret: process.env.SECRET_ACCESS_JWT,
        expiresIn: '60s',
      },
    );
  }

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.findOne(username);
    const isCorrectPassword = await bcrypt.compare(pass, user?.password)

    console.log(user, isCorrectPassword)

    if (!user || !isCorrectPassword) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.userId, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
