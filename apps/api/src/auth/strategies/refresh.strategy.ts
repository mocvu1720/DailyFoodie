import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { JwtPayLoad } from '../types/jwt-payload.type';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      secretOrKey: process.env.JWT_SECRET || 'secret',
    });
  }

  validate(
    req: Request,
    payload: JwtPayLoad & { refreshToken: string },
  ): unknown {
    const { refreshToken } = req.body as unknown as RefreshTokenDto;

    return { ...payload, refreshToken };
  }
}
