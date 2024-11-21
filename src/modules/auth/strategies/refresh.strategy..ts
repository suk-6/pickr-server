import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { User } from '@prisma/client';

import { JwtPayload } from '@common/models/jwt';

import { AuthService } from '../auth.service';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    readonly configService: ConfigService,
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
    if (type !== 'REFRESH') return false;

    const token = req.headers.authorization.split(' ')[1];
    const isValid = await this.authService.verifyRefreshToken(id, token);
    if (!isValid) return false;

    return { id };
  }
}
