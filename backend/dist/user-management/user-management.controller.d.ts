import { UserManagementService } from './user-management.service';
import { RoleType } from '../entities/role.entity';
export declare class UserManagementController {
    private userManagementService;
    constructor(userManagementService: UserManagementService);
    apiLogin(body: {
        email: string;
        password: string;
        deviceId?: string;
    }, req: any): Promise<{
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
            passwordResetToken?: string;
            passwordResetExpires?: Date;
            passwordResetUsed?: boolean;
        };
        roles: {
            id: string;
            name: string;
            type: RoleType;
        }[];
    }>;
    apiLogout(body: {
        userId: string;
        deviceId?: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    getAllUsers(req: any, search?: string): Promise<{
        roles: {
            id: import("typeorm").ObjectId;
            name: string;
            type: RoleType;
        }[];
        _id: import("typeorm").ObjectId;
        email: string;
        password: string;
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
        passwordResetToken?: string;
        passwordResetExpires?: Date;
        passwordResetUsed?: boolean;
    }[]>;
    createUser(userData: any): Promise<{
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
        passwordResetToken?: string;
        passwordResetExpires?: Date;
        passwordResetUsed?: boolean;
    }>;
    updateUser(userId: string, userData: any): Promise<{
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
        passwordResetToken?: string;
        passwordResetExpires?: Date;
        passwordResetUsed?: boolean;
    }>;
    deleteUser(userId: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    toggleUserStatus(userId: string, body: {
        isActive: boolean;
    }): Promise<{
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
        passwordResetToken?: string;
        passwordResetExpires?: Date;
        passwordResetUsed?: boolean;
    }>;
    getAllOrganizations(): Promise<import("../entities/organization.entity").Organization[]>;
    getAllRoles(search?: string): Promise<import("../entities/role.entity").Role[]>;
    getAllPermissions(search?: string): Promise<import("../entities/permission.entity").Permission[]>;
    getAllModules(): Promise<import("../entities/module.entity").Module[]>;
    updateUserRoles(userId: string, body: {
        roleIds: string[];
    }): Promise<{
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
        passwordResetToken?: string;
        passwordResetExpires?: Date;
        passwordResetUsed?: boolean;
    }>;
    createRole(roleData: any, req: any): Promise<import("../entities/role.entity").Role>;
    updateRole(roleId: string, roleData: any, req: any): Promise<import("../entities/role.entity").Role>;
    createPermission(permissionData: any, req: any): Promise<import("../entities/permission.entity").Permission>;
    updatePermission(permissionId: string, permissionData: any, req: any): Promise<import("../entities/permission.entity").Permission>;
    deletePermission(permissionId: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteRole(roleId: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
