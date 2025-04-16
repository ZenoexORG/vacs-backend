import { SetMetadata, applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PermissionsGuard } from '../../modules/auth/permissions.guard';
import { AppPermissions } from '../enums/permissions.enum';

export const PERMISSIONS_KEY = 'permissions';

export const RequirePermissions = (...permissions: AppPermissions[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

export const Auth = (...permissions: AppPermissions[]) =>
  applyDecorators(
    ApiBearerAuth(),
    UseGuards(AuthGuard('jwt'), PermissionsGuard),
    RequirePermissions(...permissions)
  );