import { ObjectId } from 'typeorm';
export declare class Collection {
    _id: ObjectId;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    isActive: boolean;
    isExclusive: boolean;
    isAppointmentRequired: boolean;
    isFeatured: boolean;
    productIds: string[];
    seo: {
        title?: string;
        description?: string;
        keywords?: string;
    };
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
