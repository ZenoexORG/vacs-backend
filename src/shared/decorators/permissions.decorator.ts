import { SetMetadata } from '@nestjs/common';
import { AppPermissions } from '../enums/permissions.enum';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: AppPermissions[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);