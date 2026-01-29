import { ObjectId } from 'typeorm';
export declare enum PageStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    ARCHIVED = "archived"
}
export declare class Page {
    _id: ObjectId;
    title: string;
    slug: string;
    content: string;
    status: PageStatus;
    seo: {
        title?: string;
        description?: string;
        keywords?: string;
        ogImage?: string;
    };
    createdAt: Date;
    updatedAt: Date;
    authorId?: string;
    constructor();
}
