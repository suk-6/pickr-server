import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/modules/user/user.service';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { User } from '@prisma/client';

import { JwtPayload } from '@common/models/jwt';

import { AuthService } from '../auth.service';

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(req: Request, { id, type }: Pick<User, 'id'> & JwtPayload) {
    if (type !== 'ACCESS') return false;

    const token = req.headers.authorization.split(' ')[1];
    const isValid = await this.authService.verifyAccessToken(id, token);
    if (!isValid) return false;

    const user = await this.userService.findOneById(id);
    if (!user) return false;

    return user;
  }
}
