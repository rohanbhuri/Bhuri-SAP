import { ObjectId } from 'typeorm';
export declare enum BlogStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    ARCHIVED = "archived"
}
export declare class BlogPost {
    _id: ObjectId;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featuredImage: string;
    gallery: {
        url: string;
        caption?: string;
        order?: number;
    }[];
    status: BlogStatus;
    isFeatured: boolean;
    seo: {
        title?: string;
        description?: string;
        keywords?: string;
        ogImage?: string;
    };
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    publishedAt?: Date;
    authorId?: string;
    createdBy?: string;
    updatedBy?: string;
    changeLog: Array<{
        userId: string;
        action: string;
        timestamp: Date;
        details?: string;
    }>;
    constructor();
}
