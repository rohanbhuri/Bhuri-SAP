import { ObjectId } from 'typeorm';
export declare enum NewsStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    ARCHIVED = "archived"
}
export declare enum MediaType {
    IMAGE = "image",
    VIDEO = "video",
    DOCUMENT = "document"
}
export declare class NewsMedia {
    _id: ObjectId;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featuredImage: string;
    mediaFiles: {
        type: MediaType;
        url: string;
        caption?: string;
    }[];
    gallery: {
        url: string;
        caption?: string;
        order?: number;
    }[];
    status: NewsStatus;
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
