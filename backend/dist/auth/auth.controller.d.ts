import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
declare class LoginDto {
    email: string;
    password: string;
    deviceId?: string;
}
declare class SignupDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}
declare class UpdateProfileDto {
    firstName: string;
    lastName: string;
}
export declare class AuthController {
    private authService;
    private usersService;
    constructor(authService: AuthService, usersService: UsersService);
    login(loginDto: LoginDto, req: any): Promise<{
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
    logout(req: any, body: {
        deviceId?: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    signup(signupDto: SignupDto): Promise<{
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
    updateOrganization(req: any, body: {
        organizationId: string;
    }): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        organizationId: string;
    }>;
    getProfile(req: any): Promise<{
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
    updateProfile(req: any, updateProfileDto: UpdateProfileDto): Promise<{
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
    uploadAvatar(req: any, file: Express.Multer.File): Promise<{
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
export {};
