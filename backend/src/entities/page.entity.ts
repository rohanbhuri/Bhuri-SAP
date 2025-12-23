import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

export enum PageStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    ARCHIVED = 'archived'
}

@Entity('pages')
export class Page {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    title: string;

    @Column()
    slug: string;

    @Column()
    content: string; // HTML Content

    @Column({ type: 'enum', enum: PageStatus, default: PageStatus.DRAFT })
    status: PageStatus;

    @Column({ type: 'json', default: {} })
    seo: {
        title?: string;
        description?: string;
        keywords?: string;
        ogImage?: string;
    };

    @Column()
    createdAt: Date;

    @Column({ nullable: true })
    updatedAt: Date;

    @Column({ nullable: true })
    authorId?: string;

    constructor() {
        this.status = PageStatus.DRAFT;
        this.seo = {};
        this.createdAt = new Date();
    }
}
