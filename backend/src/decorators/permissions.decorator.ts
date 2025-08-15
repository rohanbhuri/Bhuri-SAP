import { SetMetadata } from '@nestjs/common';
import { RoleType } from '../entities/role.entity';

export const RequirePermissions = (...permissions: string[]) => SetMetadata('permissions', permissions);
export const RequireRoles = (...roles: RoleType[]) => SetMetadata('roles', roles);