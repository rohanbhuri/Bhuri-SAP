"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mongodb_1 = require("mongodb");
const user_entity_1 = require("../entities/user.entity");
const role_entity_1 = require("../entities/role.entity");
const permission_entity_1 = require("../entities/permission.entity");
let PermissionsGuard = class PermissionsGuard {
    constructor(reflector, userRepository, roleRepository, permissionRepository) {
        this.reflector = reflector;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
    }
    async canActivate(context) {
        const requiredPermissions = this.reflector.get('permissions', context.getHandler());
        const requiredRoles = this.reflector.get('roles', context.getHandler());
        if (!requiredPermissions && !requiredRoles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            return false;
        }
        const fullUser = await this.userRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(user.userId) }
        });
        if (!fullUser) {
            return false;
        }
        const userRoles = await this.roleRepository.find({
            where: { _id: { $in: fullUser.roleIds } }
        });
        if (userRoles.some(role => role.type === role_entity_1.RoleType.SUPER_ADMIN)) {
            return true;
        }
        if (requiredRoles && !userRoles.some(role => requiredRoles.includes(role.type))) {
            return false;
        }
        if (requiredPermissions) {
            const rolePermissions = await this.permissionRepository.find({
                where: { _id: { $in: userRoles.flatMap(r => r.permissionIds) } }
            });
            const permissionStrings = rolePermissions.map(p => `${p.module}:${p.action}`);
            return requiredPermissions.every(permission => permissionStrings.includes(permission));
        }
        return true;
    }
};
exports.PermissionsGuard = PermissionsGuard;
exports.PermissionsGuard = PermissionsGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(3, (0, typeorm_1.InjectRepository)(permission_entity_1.Permission)),
    __metadata("design:paramtypes", [core_1.Reflector,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository])
], PermissionsGuard);
//# sourceMappingURL=permissions.guard.js.map