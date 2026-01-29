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
exports.UserManagementService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mongodb_1 = require("mongodb");
const user_entity_1 = require("../entities/user.entity");
const role_entity_1 = require("../entities/role.entity");
const permission_entity_1 = require("../entities/permission.entity");
const module_entity_1 = require("../entities/module.entity");
const organization_entity_1 = require("../entities/organization.entity");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
let UserManagementService = class UserManagementService {
    constructor(userRepository, roleRepository, permissionRepository, moduleRepository, organizationRepository, jwtService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
        this.moduleRepository = moduleRepository;
        this.organizationRepository = organizationRepository;
        this.jwtService = jwtService;
    }
    async apiLogin(email, password, deviceId, userAgent, ip) {
        const user = await this.userRepository.findOne({ where: { email, isDeleted: { $ne: true } } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('User account is inactive');
        }
        if (user.ipWhitelist && user.ipWhitelist.trim() !== '') {
            const allowedIps = user.ipWhitelist.split(',').map(i => i.trim());
            if (ip && !allowedIps.includes(ip) && !allowedIps.includes('127.0.0.1') && !allowedIps.includes('::1')) {
                throw new common_1.UnauthorizedException(`Access from IP ${ip} is not allowed.`);
            }
        }
        if (user.restrictToBusinessHours) {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const currentTime = hours + minutes / 60;
            if (currentTime < 9 || currentTime >= 18) {
                throw new common_1.UnauthorizedException('Login is restricted to business hours (9:00 AM - 6:00 PM).');
            }
        }
        await this.handleSession(user, deviceId || `agent-${Buffer.from(userAgent || 'unknown').toString('base64').substring(0, 16)}`, userAgent);
        const roles = await this.roleRepository.find({
            where: { _id: { $in: user.roleIds } }
        });
        const payload = {
            email: user.email,
            sub: user._id.toString(),
            organizationId: user.organizationId?.toString() || user.organizationIds[0]?.toString(),
            roles: roles.map(r => r.type),
            deviceId
        };
        const { password: _, ...userWithoutPassword } = user;
        const signOptions = {};
        if (user.sessionTimeout) {
            signOptions.expiresIn = `${user.sessionTimeout}m`;
        }
        return {
            access_token: this.jwtService.sign(payload, signOptions),
            user: userWithoutPassword,
            roles: roles.map(r => ({ id: r._id.toString(), name: r.name, type: r.type }))
        };
    }
    async handleSession(user, deviceId, userAgent) {
        if (!user.activeDevices) {
            user.activeDevices = [];
        }
        const existingDeviceIndex = user.activeDevices.findIndex(d => d.deviceId === deviceId);
        if (existingDeviceIndex !== -1) {
            user.activeDevices[existingDeviceIndex].lastActive = new Date();
            user.activeDevices[existingDeviceIndex].userAgent = userAgent;
        }
        else {
            if (user.maxDevices && user.activeDevices.length >= user.maxDevices) {
                throw new common_1.UnauthorizedException(`Maximum device limit reached (${user.maxDevices}). Please logout from another device.`);
            }
            user.activeDevices.push({
                deviceId,
                lastActive: new Date(),
                userAgent
            });
        }
        await this.userRepository.save(user);
    }
    async apiLogout(userId, deviceId) {
        const user = await this.userRepository.findOne({ where: { _id: new mongodb_1.ObjectId(userId) } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (deviceId && user.activeDevices) {
            user.activeDevices = user.activeDevices.filter(d => d.deviceId !== deviceId);
            await this.userRepository.save(user);
        }
        return { success: true, message: 'Logged out successfully' };
    }
    async getAllUsers(currentUser) {
        let users = await this.userRepository.find({ where: { isDeleted: { $ne: true } } });
        if (currentUser) {
            const user = await this.userRepository.findOne({
                where: { _id: new mongodb_1.ObjectId(currentUser.userId) }
            });
            const userRoles = await this.roleRepository.find({
                where: { _id: { $in: user.roleIds } }
            });
            const isSuperAdmin = userRoles.some(role => role.type === role_entity_1.RoleType.SUPER_ADMIN);
            const currentUserMaxLevel = Math.max(...userRoles.map(r => r.hierarchyLevel || 0), 0);
            if (!isSuperAdmin) {
                const allRoles = await this.roleRepository.find();
                users = users.filter(u => {
                    if (u._id.equals(user._id))
                        return true;
                    const targetUserRoles = allRoles.filter(r => u.roleIds.some(roleId => r._id.equals(roleId)));
                    const targetUserMaxLevel = Math.max(...targetUserRoles.map(r => r.hierarchyLevel || 0), 0);
                    return targetUserMaxLevel < currentUserMaxLevel;
                });
            }
        }
        return this.populateUserRoles(users);
    }
    async searchUsers(query, currentUser) {
        const searchRegex = new RegExp(query, 'i');
        let users = await this.userRepository.find({ where: { isDeleted: { $ne: true } } });
        users = users.filter(u => searchRegex.test(u.firstName) ||
            searchRegex.test(u.lastName) ||
            searchRegex.test(u.email));
        if (currentUser) {
            const user = await this.userRepository.findOne({
                where: { _id: new mongodb_1.ObjectId(currentUser.userId) }
            });
            const userRoles = await this.roleRepository.find({
                where: { _id: { $in: user.roleIds } }
            });
            const isSuperAdmin = userRoles.some(role => role.type === role_entity_1.RoleType.SUPER_ADMIN);
            const currentUserMaxLevel = Math.max(...userRoles.map(r => r.hierarchyLevel || 0), 0);
            if (!isSuperAdmin) {
                const allRoles = await this.roleRepository.find();
                users = users.filter(u => {
                    if (u._id.equals(user._id))
                        return true;
                    const targetUserRoles = allRoles.filter(r => u.roleIds.some(roleId => r._id.equals(roleId)));
                    const targetUserMaxLevel = Math.max(...targetUserRoles.map(r => r.hierarchyLevel || 0), 0);
                    return targetUserMaxLevel < currentUserMaxLevel;
                });
            }
        }
        return this.populateUserRoles(users);
    }
    async searchRoles(query) {
        const searchRegex = new RegExp(query, 'i');
        const roles = await this.roleRepository.find({ where: { isDeleted: { $ne: true } } });
        return roles.filter(r => searchRegex.test(r.name) || searchRegex.test(r.type));
    }
    async searchPermissions(query) {
        const searchRegex = new RegExp(query, 'i');
        const permissions = await this.permissionRepository.find({ where: { isDeleted: { $ne: true } } });
        return permissions.filter(p => searchRegex.test(p.module) ||
            searchRegex.test(p.action) ||
            searchRegex.test(p.resource));
    }
    async populateUserRoles(users) {
        return Promise.all(users.map(async (user) => {
            if (user.roleIds && user.roleIds.length > 0) {
                const roles = await this.roleRepository.find({
                    where: { _id: { $in: user.roleIds } }
                });
                return {
                    ...user,
                    roles: roles.map(role => ({ id: role._id, name: role.name, type: role.type }))
                };
            }
            return { ...user, roles: [] };
        }));
    }
    async createUser(userData) {
        const existingUser = await this.userRepository.findOne({ where: { email: userData.email, isDeleted: { $ne: true } } });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = this.userRepository.create({
            email: userData.email,
            password: hashedPassword,
            firstName: userData.firstName,
            lastName: userData.lastName,
            isActive: userData.isActive ?? true,
            organizationId: userData.organizationId ? new mongodb_1.ObjectId(userData.organizationId) : null,
            organizationIds: userData.organizationId ? [new mongodb_1.ObjectId(userData.organizationId)] : [],
            roleIds: userData.roleIds?.map(id => new mongodb_1.ObjectId(id)) || [],
            currency: userData.currency || 'INR',
            currencySymbol: userData.currencySymbol || '₹',
            forcePasswordChange: userData.forcePasswordChange || false,
            requireTwoFactor: userData.requireTwoFactor || false,
            restrictToBusinessHours: userData.restrictToBusinessHours || false,
            allowApiAccess: userData.allowApiAccess || false,
            sessionTimeout: userData.sessionTimeout || null,
            maxDevices: userData.maxDevices || null,
            ipWhitelist: userData.ipWhitelist || null,
            enableEmailNotifications: userData.enableEmailNotifications || false
        });
        const savedUser = await this.userRepository.save(user);
        const { password, ...userWithoutPassword } = savedUser;
        return userWithoutPassword;
    }
    async updateUser(userId, userData) {
        const user = await this.userRepository.findOne({ where: { _id: new mongodb_1.ObjectId(userId) } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (userData.email && userData.email !== user.email) {
            const existingUser = await this.userRepository.findOne({ where: { email: userData.email } });
            if (existingUser) {
                throw new common_1.ConflictException('User with this email already exists');
            }
        }
        if (userData.email)
            user.email = userData.email;
        if (userData.firstName)
            user.firstName = userData.firstName;
        if (userData.lastName)
            user.lastName = userData.lastName;
        if (userData.isActive !== undefined)
            user.isActive = userData.isActive;
        if (userData.organizationId) {
            user.organizationId = new mongodb_1.ObjectId(userData.organizationId);
            if (!user.organizationIds.some(id => id.equals(new mongodb_1.ObjectId(userData.organizationId)))) {
                user.organizationIds.push(new mongodb_1.ObjectId(userData.organizationId));
            }
        }
        if (userData.roleIds)
            user.roleIds = userData.roleIds.map(id => new mongodb_1.ObjectId(id));
        if (userData.currency)
            user.currency = userData.currency;
        if (userData.currencySymbol)
            user.currencySymbol = userData.currencySymbol;
        if (userData.forcePasswordChange !== undefined)
            user.forcePasswordChange = userData.forcePasswordChange;
        if (userData.requireTwoFactor !== undefined)
            user.requireTwoFactor = userData.requireTwoFactor;
        if (userData.restrictToBusinessHours !== undefined)
            user.restrictToBusinessHours = userData.restrictToBusinessHours;
        if (userData.allowApiAccess !== undefined)
            user.allowApiAccess = userData.allowApiAccess;
        if (userData.sessionTimeout !== undefined)
            user.sessionTimeout = userData.sessionTimeout;
        if (userData.maxDevices !== undefined)
            user.maxDevices = userData.maxDevices;
        if (userData.ipWhitelist !== undefined)
            user.ipWhitelist = userData.ipWhitelist;
        if (userData.enableEmailNotifications !== undefined)
            user.enableEmailNotifications = userData.enableEmailNotifications;
        if (userData.password) {
            user.password = await bcrypt.hash(userData.password, 10);
        }
        const savedUser = await this.userRepository.save(user);
        const { password, ...userWithoutPassword } = savedUser;
        return userWithoutPassword;
    }
    async deleteUser(userId, deletedBy) {
        const user = await this.userRepository.findOne({ where: { _id: new mongodb_1.ObjectId(userId) } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const changeLog = user.changeLog || [];
        if (deletedBy) {
            changeLog.push({ userId: deletedBy, action: 'deleted', timestamp: new Date(), details: 'User soft-deleted' });
        }
        await this.userRepository.update({ _id: new mongodb_1.ObjectId(userId) }, {
            isDeleted: true,
            isActive: false,
            deletedAt: new Date(),
            deletedBy: deletedBy,
            changeLog: changeLog
        });
        return { success: true, message: 'User deleted successfully' };
    }
    async toggleUserStatus(userId, isActive) {
        const user = await this.userRepository.findOne({ where: { _id: new mongodb_1.ObjectId(userId) } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        user.isActive = isActive;
        const savedUser = await this.userRepository.save(user);
        const { password, ...userWithoutPassword } = savedUser;
        return userWithoutPassword;
    }
    async getAllRoles() {
        return this.roleRepository.find({ where: { isDeleted: { $ne: true } } });
    }
    async createRole(roleData, userId) {
        const existingRole = await this.roleRepository.findOne({ where: { name: roleData.name, isDeleted: { $ne: true } } });
        if (existingRole) {
            throw new common_1.ConflictException('Role with this name already exists');
        }
        const role = this.roleRepository.create({
            name: roleData.name,
            type: roleData.type,
            description: roleData.description || '',
            hierarchyLevel: roleData.hierarchyLevel || 0,
            permissionIds: roleData.permissionIds?.map(id => new mongodb_1.ObjectId(id)) || [],
            changeLog: userId ? [{ userId, action: 'created', timestamp: new Date(), details: 'Role created' }] : []
        });
        return this.roleRepository.save(role);
    }
    async updateRole(roleId, roleData, userId) {
        const role = await this.roleRepository.findOne({ where: { _id: new mongodb_1.ObjectId(roleId) } });
        if (!role) {
            throw new common_1.NotFoundException('Role not found');
        }
        if (roleData.name && roleData.name !== role.name) {
            const existingRole = await this.roleRepository.findOne({ where: { name: roleData.name, isDeleted: { $ne: true } } });
            if (existingRole) {
                throw new common_1.ConflictException('Role with this name already exists');
            }
        }
        const changeLog = role.changeLog || [];
        if (userId) {
            const changes = [];
            const skipFields = ['updatedAt', 'changeLog', '_id'];
            for (const key in roleData) {
                if (skipFields.includes(key))
                    continue;
                if (JSON.stringify(role[key]) !== JSON.stringify(roleData[key])) {
                    changes.push(key);
                }
            }
            if (changes.length > 0) {
                changeLog.push({ userId, action: 'updated', timestamp: new Date(), details: `Updated: ${changes.join(', ')}` });
            }
        }
        if (roleData.name)
            role.name = roleData.name;
        if (roleData.type)
            role.type = roleData.type;
        if (roleData.description !== undefined)
            role.description = roleData.description;
        if (roleData.hierarchyLevel !== undefined)
            role.hierarchyLevel = roleData.hierarchyLevel;
        if (roleData.permissionIds)
            role.permissionIds = roleData.permissionIds.map(id => new mongodb_1.ObjectId(id));
        role.changeLog = changeLog;
        return this.roleRepository.save(role);
    }
    async deleteRole(roleId, userId) {
        const role = await this.roleRepository.findOne({ where: { _id: new mongodb_1.ObjectId(roleId) } });
        if (!role) {
            throw new common_1.NotFoundException('Role not found');
        }
        const changeLog = role.changeLog || [];
        if (userId) {
            changeLog.push({ userId, action: 'deleted', timestamp: new Date(), details: 'Role soft-deleted' });
        }
        await this.roleRepository.update({ _id: new mongodb_1.ObjectId(roleId) }, {
            isDeleted: true,
            deletedAt: new Date(),
            deletedBy: userId,
            changeLog
        });
        return { success: true, message: 'Role deleted successfully' };
    }
    async getAllPermissions() {
        return this.permissionRepository.find({ where: { isDeleted: { $ne: true } } });
    }
    async createPermission(permissionData, userId) {
        const existingPermission = await this.permissionRepository.findOne({
            where: { module: permissionData.module, action: permissionData.action, resource: permissionData.resource, isDeleted: { $ne: true } }
        });
        if (existingPermission) {
            throw new common_1.ConflictException('Permission already exists');
        }
        const permission = this.permissionRepository.create({
            module: permissionData.module,
            action: permissionData.action,
            resource: permissionData.resource,
            description: permissionData.description || '',
            changeLog: userId ? [{ userId, action: 'created', timestamp: new Date(), details: 'Permission created' }] : []
        });
        return this.permissionRepository.save(permission);
    }
    async updatePermission(permissionId, permissionData, userId) {
        const permission = await this.permissionRepository.findOne({ where: { _id: new mongodb_1.ObjectId(permissionId) } });
        if (!permission) {
            throw new common_1.NotFoundException('Permission not found');
        }
        const changeLog = permission.changeLog || [];
        if (userId) {
            const changes = [];
            const skipFields = ['updatedAt', 'changeLog', '_id'];
            for (const key in permissionData) {
                if (skipFields.includes(key))
                    continue;
                if (JSON.stringify(permission[key]) !== JSON.stringify(permissionData[key])) {
                    changes.push(key);
                }
            }
            if (changes.length > 0) {
                changeLog.push({ userId, action: 'updated', timestamp: new Date(), details: `Updated: ${changes.join(', ')}` });
            }
        }
        if (permissionData.module)
            permission.module = permissionData.module;
        if (permissionData.action)
            permission.action = permissionData.action;
        if (permissionData.resource)
            permission.resource = permissionData.resource;
        if (permissionData.description !== undefined)
            permission.description = permissionData.description;
        permission.changeLog = changeLog;
        return this.permissionRepository.save(permission);
    }
    async deletePermission(permissionId, userId) {
        const permission = await this.permissionRepository.findOne({ where: { _id: new mongodb_1.ObjectId(permissionId) } });
        if (!permission) {
            throw new common_1.NotFoundException('Permission not found');
        }
        const changeLog = permission.changeLog || [];
        if (userId) {
            changeLog.push({ userId, action: 'deleted', timestamp: new Date(), details: 'Permission soft-deleted' });
        }
        await this.permissionRepository.update({ _id: new mongodb_1.ObjectId(permissionId) }, {
            isDeleted: true,
            deletedAt: new Date(),
            deletedBy: userId,
            changeLog
        });
        return { success: true, message: 'Permission deleted successfully' };
    }
    async getAllOrganizations() {
        return this.organizationRepository.find();
    }
    async getAllModules() {
        return this.moduleRepository.find();
    }
    async updateUserRoles(userId, roleIds) {
        const user = await this.userRepository.findOne({ where: { _id: new mongodb_1.ObjectId(userId) } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        user.roleIds = roleIds.map(id => new mongodb_1.ObjectId(id));
        const savedUser = await this.userRepository.save(user);
        const { password, ...userWithoutPassword } = savedUser;
        return userWithoutPassword;
    }
};
exports.UserManagementService = UserManagementService;
exports.UserManagementService = UserManagementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(2, (0, typeorm_1.InjectRepository)(permission_entity_1.Permission)),
    __param(3, (0, typeorm_1.InjectRepository)(module_entity_1.Module)),
    __param(4, (0, typeorm_1.InjectRepository)(organization_entity_1.Organization)),
    __metadata("design:paramtypes", [typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        jwt_1.JwtService])
], UserManagementService);
//# sourceMappingURL=user-management.service.js.map