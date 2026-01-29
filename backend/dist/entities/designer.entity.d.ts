import { ObjectId } from 'typeorm';
export declare class Designer {
    _id: ObjectId;
    name: string;
    bio?: string;
    description?: string;
    profileImage?: string;
    portfolioImages: string[];
    email?: string;
    phone?: string;
    website?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
    updatedBy?: string;
    changeLog: Array<{
        userId: string;
        action: string;
        timestamp: Date;
        details?: string;
    }>;
    isDeleted: boolean;
    deletedAt: Date;
    deletedBy: string;
    constructor();
}
