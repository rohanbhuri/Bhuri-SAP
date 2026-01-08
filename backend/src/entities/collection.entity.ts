import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity('collections')
export class Collection {
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

    @Column()
    isActive: boolean;

    @Column('array')
    productIds: string[];

    @Column({ type: 'json', default: {} })
    seo: {
        title?: string;
        description?: string;
        keywords?: string;
    };

    @Column()
    createdAt: Date;

    @Column({ nullable: true })
    updatedAt: Date;

    constructor() {
        this.isActive = true;
        this.productIds = [];
        this.createdAt = new Date();
    }
}
