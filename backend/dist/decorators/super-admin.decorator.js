"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireAnyRole = exports.RequireAdminOrSuperAdmin = exports.RequireSuperAdmin = void 0;
const common_1 = require("@nestjs/common");
const role_entity_1 = require("../entities/role.entity");
const RequireSuperAdmin = () => (0, common_1.SetMetadata)('roles', [role_entity_1.RoleType.SUPER_ADMIN]);
exports.RequireSuperAdmin = RequireSuperAdmin;
const RequireAdminOrSuperAdmin = () => (0, common_1.SetMetadata)('roles', [role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN]);
exports.RequireAdminOrSuperAdmin = RequireAdminOrSuperAdmin;
const RequireAnyRole = () => (0, common_1.SetMetadata)('roles', [role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN, role_entity_1.RoleType.STAFF]);
exports.RequireAnyRole = RequireAnyRole;
//# sourceMappingURL=super-admin.decorator.js.map