"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireRoles = exports.RequirePermissions = void 0;
const common_1 = require("@nestjs/common");
const RequirePermissions = (...permissions) => (0, common_1.SetMetadata)('permissions', permissions);
exports.RequirePermissions = RequirePermissions;
const RequireRoles = (...roles) => (0, common_1.SetMetadata)('roles', roles);
exports.RequireRoles = RequireRoles;
//# sourceMappingURL=permissions.decorator.js.map