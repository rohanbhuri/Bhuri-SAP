import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity('categories')
export class Category {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    name: string;

    @Column()
    slug: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ nullable: true })
    image?: string;

    @Column({ nullable: true })
    parentId?: string;

    @Column({ type: 'json', default: {} })
    seo: {
        title?: string;
        description?: string;
        keywords?: string;
    };

    @Column()
    isActive: boolean;

    @Column()
    createdAt: Date;

    @Column({ nullable: true })
    updatedAt: Date;

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

    @Column({ default: false })
    isDeleted: boolean;

    @Column({ nullable: true })
    deletedAt: Date;

    @Column({ nullable: true })
    deletedBy: string;

    constructor() {
        this.isActive = true;
        this.createdAt = new Date();
        this.changeLog = [];
    }
}
