import { SetMetadata } from '@nestjs/common';
import { RoleType } from '../entities/role.entity';

export const RequireSuperAdmin = () => SetMetadata('roles', [RoleType.SUPER_ADMIN]);
export const RequireAdminOrSuperAdmin = () => SetMetadata('roles', [RoleType.SUPER_ADMIN, RoleType.ADMIN]);
export const RequireAnyRole = () => SetMetadata('roles', [RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.STAFF]);