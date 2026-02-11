import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

export enum NewsStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    ARCHIVED = 'archived'
}

export enum MediaType {
    IMAGE = 'image',
    VIDEO = 'video',
    DOCUMENT = 'document'
}

@Entity('news_media')
export class NewsMedia {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    title: string;

    @Column()
    slug: string;

    @Column()
    content: string;

    @Column({ nullable: true })
    excerpt: string;

    @Column({ nullable: true })
    featuredImage: string;

    @Column({ type: 'array', default: [] })
    mediaFiles: {
        type: MediaType;
        url: string;
        caption?: string;
    }[];

    @Column({ type: 'array', default: [] })
    gallery: {
        url: string;
        caption?: string;
        order?: number;
    }[];

    @Column({ type: 'enum', enum: NewsStatus, default: NewsStatus.DRAFT })
    status: NewsStatus;

    @Column({ default: false })
    isFeatured: boolean;

    @Column({ type: 'json', default: {} })
    seo: {
        title?: string;
        description?: string;
        keywords?: string;
        ogImage?: string;
    };

    @Column({ type: 'array', default: [] })
    tags: string[];

    @Column()
    createdAt: Date;

    @Column({ nullable: true })
    updatedAt: Date;

    @Column({ nullable: true })
    publishedAt?: Date;

    @Column({ nullable: true })
    authorId?: string;

    @Column({ nullable: true })
    createdBy?: string;

    @Column({ nullable: true })
    updatedBy?: string;

    @Column({ type: 'json', default: [] })
    changeLog: Array<{
        userId: string;
        action: string;
        timestamp: Date;
        details?: string;
    }>;

    constructor() {
        this.status = NewsStatus.DRAFT;
        this.isFeatured = false;
        this.seo = {};
        this.tags = [];
        this.mediaFiles = [];
        this.gallery = [];
        this.createdAt = new Date();
        this.changeLog = [];
    }
}
