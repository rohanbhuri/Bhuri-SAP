import { ObjectId } from 'typeorm';
export declare class User {
    _id: ObjectId;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    currency: string;
    currencySymbol: string;
    isActive: boolean;
    organizationIds: ObjectId[];
    organizationId?: ObjectId;
    roleIds: ObjectId[];
    activeModuleIds: ObjectId[];
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
    constructor();
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    passwordResetUsed?: boolean;
}
