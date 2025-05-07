import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from 'src/shared/decorators/permissions.decorator';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      PERMISSIONS_KEY,
      context.getHandler(),
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.permissions || user.permissions.length === 0) {
      throw new ForbiddenException('Do not have the required permissions');
    }

    const hasPermissions = requiredPermissions.some((perm) =>
      user.permissions.includes(perm),
    );

    if (!hasPermissions) {
      throw new ForbiddenException('Do not have the required permissions');
    }
    return true;
  }
}
