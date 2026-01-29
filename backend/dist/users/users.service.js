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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mongodb_1 = require("mongodb");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../entities/user.entity");
const role_entity_1 = require("../entities/role.entity");
const permission_entity_1 = require("../entities/permission.entity");
let UsersService = class UsersService {
    constructor(userRepository, roleRepository, permissionRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
    }
    async findByEmail(email) {
        return this.userRepository.findOne({ where: { email } });
    }
    async findAll(currentUser) {
        const user = await this.userRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(currentUser.userId) }
        });
        const userRoles = await this.roleRepository.find({
            where: { _id: { $in: user.roleIds } }
        });
        const isSuperAdmin = userRoles.some(role => role.type === role_entity_1.RoleType.SUPER_ADMIN);
        const currentUserMaxLevel = Math.max(...userRoles.map(r => r.hierarchyLevel || 0), 0);
        let users;
        if (isSuperAdmin) {
            users = await this.userRepository.find();
        }
        else {
            users = await this.userRepository.find({
                where: { organizationId: user.organizationId }
            });
            const allRoles = await this.roleRepository.find();
            users = users.filter(u => {
                if (u._id.equals(user._id))
                    return true;
                const targetUserRoles = allRoles.filter(r => u.roleIds.some(roleId => r._id.equals(roleId)));
                const targetUserMaxLevel = Math.max(...targetUserRoles.map(r => r.hierarchyLevel || 0), 0);
                return targetUserMaxLevel < currentUserMaxLevel;
            });
        }
        const usersWithRoles = await Promise.all(users.map(async (u) => {
            if (u.roleIds && u.roleIds.length > 0) {
                const roles = await this.roleRepository.find({
                    where: { _id: { $in: u.roleIds } }
                });
                return {
                    ...u,
                    roles: roles.map(role => ({ id: role._id, name: role.name, type: role.type }))
                };
            }
            return { ...u, roles: [] };
        }));
        return usersWithRoles;
    }
    async create(userData, currentUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const roleIds = userData.roleIds ? userData.roleIds.map(id => new mongodb_1.ObjectId(id)) : [];
        const user = this.userRepository.create({
            ...userData,
            password: hashedPassword,
            organizationId: new mongodb_1.ObjectId(userData.organizationId),
            roleIds,
        });
        const savedUser = await this.userRepository.save(user);
        if (roleIds.length > 0) {
            const roles = await this.roleRepository.find({
                where: { _id: { $in: roleIds } }
            });
            return {
                ...savedUser,
                roles: roles.map(role => ({ id: role._id, name: role.name, type: role.type }))
            };
        }
        return { ...savedUser, roles: [] };
    }
    async createPublic(userData) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = this.userRepository.create({
            ...userData,
            password: hashedPassword,
            organizationId: userData.organizationId ? new mongodb_1.ObjectId(userData.organizationId) : null,
            roleIds: [],
        });
        return this.userRepository.save(user);
    }
    async findOne(id) {
        const user = await this.userRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(id) }
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const roles = await this.roleRepository.find({
            where: { _id: { $in: user.roleIds } }
        });
        const permissions = await this.permissionRepository.find({
            where: { _id: { $in: user.roleIds.flatMap(roleId => this.roleRepository.findOne({ where: { _id: roleId } }).then(r => r?.permissionIds || [])) } }
        });
        return {
            ...user,
            roles: roles.map(role => ({ id: role._id, name: role.name, type: role.type })),
            permissions: permissions.map(perm => ({ id: perm._id, module: perm.module, action: perm.action }))
        };
    }
    async update(id, userData) {
        const user = await this.userRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(id) }
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }
        if (userData.roleIds) {
            userData.roleIds = userData.roleIds.map(id => new mongodb_1.ObjectId(id));
        }
        await this.userRepository.update({ _id: new mongodb_1.ObjectId(id) }, userData);
        return this.findOne(id);
    }
    async delete(id) {
        const result = await this.userRepository.delete({ _id: new mongodb_1.ObjectId(id) });
        if (result.affected === 0) {
            throw new common_1.NotFoundException('User not found');
        }
        return { message: 'User deleted successfully' };
    }
    async assignRole(userId, roleId, currentUser) {
        const user = await this.userRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(userId) }
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const roleObjectId = new mongodb_1.ObjectId(roleId);
        if (!user.roleIds.some(id => id.equals(roleObjectId))) {
            user.roleIds.push(roleObjectId);
            await this.userRepository.save(user);
        }
        return this.findOne(userId);
    }
    async removeRole(userId, roleId) {
        const user = await this.userRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(userId) }
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        user.roleIds = user.roleIds.filter(id => !id.equals(new mongodb_1.ObjectId(roleId)));
        await this.userRepository.save(user);
        return this.findOne(userId);
    }
    async toggleStatus(userId, isActive) {
        const user = await this.userRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(userId) }
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        user.isActive = isActive;
        await this.userRepository.save(user);
        return this.findOne(userId);
    }
    async assignPermission(userId, permissionId) {
        const user = await this.userRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(userId) }
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        throw new common_1.ForbiddenException('Direct permission assignment not supported. Use roles instead.');
    }
    async removePermission(userId, permissionId) {
        const user = await this.userRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(userId) }
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        throw new common_1.ForbiddenException('Direct permission removal not supported. Use roles instead.');
    }
    async updateUserOrganization(userId, organizationId) {
        const user = await this.userRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(userId) }
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        user.organizationId = new mongodb_1.ObjectId(organizationId);
        await this.userRepository.save(user);
        return {
            id: user._id.toString(),
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            organizationId: organizationId
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(2, (0, typeorm_1.InjectRepository)(permission_entity_1.Permission)),
    __metadata("design:paramtypes", [typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository])
], UsersService);
//# sourceMappingURL=users.service.js.map