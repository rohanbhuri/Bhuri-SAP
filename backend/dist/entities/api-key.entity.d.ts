import { ObjectId } from 'mongodb';
export declare class ApiKey {
    _id: ObjectId;
    name: string;
    token: string;
    userId: string;
    organizationId: string;
    expiresAt: Date;
    isActive: boolean;
    allowedDomains: string[];
    usageCount: number;
    createdAt: Date;
    lastUsedAt: Date;
}
