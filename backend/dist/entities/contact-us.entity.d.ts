import { ObjectId } from 'typeorm';
export declare class ContactUs {
    _id: ObjectId;
    name: string;
    email: string;
    subject: string;
    message: string;
    organizationId: string;
    isRead: boolean;
    readAt?: Date;
    createdAt: Date;
    isDeleted: boolean;
    deletedAt: Date;
    deletedBy: string;
    changeLog: Array<{
        userId: string;
        action: string;
        timestamp: Date;
        details?: string;
    }>;
    constructor();
}
