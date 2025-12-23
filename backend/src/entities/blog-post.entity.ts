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

    @Column({ type: 'enum', enum: BlogStatus, default: BlogStatus.DRAFT })
    status: BlogStatus;

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

    constructor() {
        this.status = BlogStatus.DRAFT;
        this.seo = {};
        this.tags = [];
        this.createdAt = new Date();
    }
}
