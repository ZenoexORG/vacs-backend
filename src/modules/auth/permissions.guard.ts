import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { PERMISSIONS_KEY } from 'src/shared/decorators/permissions.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>(
      PERMISSIONS_KEY,
      context.getHandler(),
    );
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !user.permissions || user.permissions.length === 0) {
      throw new ForbiddenException('Employee do not have any permissions');
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
