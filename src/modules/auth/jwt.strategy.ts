import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([        
        (request: Request) => {
          return request?.cookies?.token;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]), 
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super_safe_secret',
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      username: payload.username,
      permissions: payload.permissions,
    };
  }
}
