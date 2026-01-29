import { ObjectId } from 'typeorm';
export declare class Category {
    _id: ObjectId;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    parentId?: string;
    seo: {
        title?: string;
        description?: string;
        keywords?: string;
    };
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
