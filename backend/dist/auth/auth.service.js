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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mongodb_1 = require("mongodb");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../entities/user.entity");
const role_entity_1 = require("../entities/role.entity");
const organization_entity_1 = require("../entities/organization.entity");
let AuthService = class AuthService {
    constructor(userRepository, roleRepository, organizationRepository, jwtService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.organizationRepository = organizationRepository;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(email, password, deviceId, userAgent, ip) {
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
            organizationId: user.organizationId?.toString() || user.organizationIds?.[0]?.toString(),
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
    async logout(userId, deviceId) {
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
    async getProfile(userId) {
        const user = await this.userRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(userId) }
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const roles = await this.roleRepository.find({
            where: { _id: { $in: user.roleIds } }
        });
        const organizations = await this.organizationRepository.find({
            where: { _id: { $in: user.organizationIds } }
        });
        let currentOrganization = null;
        if (user.organizationId) {
            currentOrganization = await this.organizationRepository.findOne({
                where: { _id: user.organizationId }
            });
        }
        return {
            id: user._id.toString(),
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            isActive: user.isActive,
            createdAt: user.createdAt,
            organizationId: user.organizationId?.toString() || null,
            roles: roles.map(role => ({
                id: role._id.toString(),
                name: role.name,
                type: role.type
            })),
            organizations: organizations.map(org => ({
                id: org._id.toString(),
                name: org.name,
                code: org.code,
                description: org.description
            })),
            currentOrganization: currentOrganization ? {
                id: currentOrganization._id.toString(),
                name: currentOrganization.name,
                code: currentOrganization.code,
                description: currentOrganization.description
            } : null
        };
    }
    async updateProfile(userId, updateData) {
        const user = await this.userRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(userId) }
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.userRepository.update({ _id: new mongodb_1.ObjectId(userId) }, {
            firstName: updateData.firstName,
            lastName: updateData.lastName
        });
        return this.getProfile(userId);
    }
    async updateAvatar(userId, avatarUrl) {
        const user = await this.userRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(userId) }
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.userRepository.update({ _id: new mongodb_1.ObjectId(userId) }, { avatar: avatarUrl });
        return this.getProfile(userId);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(2, (0, typeorm_1.InjectRepository)(organization_entity_1.Organization)),
    __metadata("design:paramtypes", [typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map