import { ObjectId } from 'mongodb';
export declare enum ClientRequestStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    CONVERTED = "CONVERTED"
}
export declare class ClientRequest {
    _id: ObjectId;
    companyName?: string;
    contactPerson: string;
    email: string;
    phone: string;
    website?: string;
    industry?: string;
    companySize?: string;
    address?: string;
    city?: string;
    country?: string;
    message?: string;
    status: ClientRequestStatus;
    notes?: string;
    convertedUserId?: ObjectId;
    convertedOrganizationId?: ObjectId;
    reviewedBy?: ObjectId;
    reviewedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    deletedAt: Date;
    deletedBy: string;
    changeLog: Array<{
        userId: string;
        action: string;
        timestamp: Date;
        details?: string;
    }>;
}
