import { RoleType } from '../entities/role.entity';
export declare const RequirePermissions: (...permissions: string[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const RequireRoles: (...roles: RoleType[]) => import("@nestjs/common").CustomDecorator<string>;
