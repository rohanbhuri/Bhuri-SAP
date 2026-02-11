import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

export enum BlogStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    ARCHIVED = 'archived'
}

@Entity('blog_posts')
export class BlogPost {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    title: string;

    @Column()
    slug: string;

    @Column()
    content: string; // HTML Content

    @Column({ nullable: true })
    excerpt: string; // Short description

    @Column({ nullable: true })
    featuredImage: string; // URL to featured image

    @Column({ type: 'array', default: [] })
    gallery: {
        url: string;
        caption?: string;
        order?: number;
    }[];

    @Column({ type: 'enum', enum: BlogStatus, default: BlogStatus.DRAFT })
    status: BlogStatus;

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
    tags: string[]; // Blog tags/categories

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
        this.status = BlogStatus.DRAFT;
        this.isFeatured = false;
        this.seo = {};
        this.tags = [];
        this.gallery = [];
        this.createdAt = new Date();
        this.changeLog = [];
    }
}
