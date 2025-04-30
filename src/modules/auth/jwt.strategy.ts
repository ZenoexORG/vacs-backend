import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { EmployeesService } from '../employees/employees.service';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly employeesService: EmployeesService,
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
    const user = await this.employeesService.findOne(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const permissions = user.role?.permissions?.map((permission) => permission.name) || [];

    return {
      id: payload.sub,
      username: payload.username,
      role: user.role,
      permissions: permissions,
    };
  }
}
