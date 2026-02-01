import { JwtService } from '@nestjs/jwt';
import { MongoRepository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Organization } from '../entities/organization.entity';
export declare class AuthService {
    private userRepository;
    private roleRepository;
    private organizationRepository;
    private jwtService;
    constructor(userRepository: MongoRepository<User>, roleRepository: MongoRepository<Role>, organizationRepository: MongoRepository<Organization>, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    login(email: string, password: string, deviceId?: string, userAgent?: string, ip?: string): Promise<{
        access_token: string;
        user: {
            _id: import("typeorm").ObjectId;
            email: string;
            firstName: string;
            lastName: string;
            avatar?: string;
            currency: string;
            currencySymbol: string;
            isActive: boolean;
            organizationIds: import("typeorm").ObjectId[];
            organizationId?: import("typeorm").ObjectId;
            roleIds: import("typeorm").ObjectId[];
            activeModuleIds: import("typeorm").ObjectId[];
            isOnline: boolean;
            lastSeen?: Date;
            forcePasswordChange: boolean;
            requireTwoFactor: boolean;
            sessionTimeout?: number;
            restrictToBusinessHours: boolean;
            allowApiAccess: boolean;
            expiryDate?: Date;
            ipWhitelist?: string;
            maxDevices?: number;
            activeDevices: {
                deviceId: string;
                lastActive: Date;
                userAgent?: string;
            }[];
            isDeleted: boolean;
            deletedAt: Date;
            deletedBy: string;
            changeLog: Array<{
                userId: string;
                action: string;
                timestamp: Date;
                details?: string;
            }>;
            enableEmailNotifications: boolean;
            createdAt: Date;
        };
    }>;
    private handleSession;
    logout(userId: string, deviceId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        avatar: string;
        isActive: boolean;
        createdAt: Date;
        roles: {
            id: string;
            name: string;
            type: import("../entities/role.entity").RoleType;
        }[];
        organizations: {
            id: string;
            name: string;
            code: string;
            description: string;
        }[];
        currentOrganization: {
            id: any;
            name: any;
            code: any;
            description: any;
        };
    }>;
    updateProfile(userId: string, updateData: {
        firstName: string;
        lastName: string;
    }): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        avatar: string;
        isActive: boolean;
        createdAt: Date;
        roles: {
            id: string;
            name: string;
            type: import("../entities/role.entity").RoleType;
        }[];
        organizations: {
            id: string;
            name: string;
            code: string;
            description: string;
        }[];
        currentOrganization: {
            id: any;
            name: any;
            code: any;
            description: any;
        };
    }>;
    updateAvatar(userId: string, avatarUrl: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        avatar: string;
        isActive: boolean;
        createdAt: Date;
        roles: {
            id: string;
            name: string;
            type: import("../entities/role.entity").RoleType;
        }[];
        organizations: {
            id: string;
            name: string;
            code: string;
            description: string;
        }[];
        currentOrganization: {
            id: any;
            name: any;
            code: any;
            description: any;
        };
    }>;
}
