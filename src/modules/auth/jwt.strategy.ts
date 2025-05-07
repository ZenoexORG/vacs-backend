import { RolePermissionsService } from 'src/shared/services/role-permissions.service';
import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly rolePermissionsService: RolePermissionsService,
  ) {
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
    const cacheKey = `auth:${payload.sub}`;
    const cachedUser = await this.cacheManager.get(cacheKey);
    if (cachedUser) {
      return cachedUser;
    }
    const permissions = await this.rolePermissionsService.getPermissionsForRole(payload.role);

    const user = {
      id: payload.sub,
      fullname: payload.fullname,
      role: payload.role,
      permissions,
    };

    await this.cacheManager.set(cacheKey, user, 3600);
    return user;
  }
}
