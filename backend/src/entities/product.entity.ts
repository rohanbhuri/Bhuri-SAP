import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity('products')
export class Product {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    name: string;

    @Column()
    sku: string;

    @Column()
    slug: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ type: 'double', default: 0 })
    price: number;

    @Column({ type: 'double', nullable: true })
    compareAtPrice?: number;

    @Column({ nullable: true })
    costPrice?: number;

    @Column()
    currency: string;

    @Column('array')
    images: string[];

    @Column({ nullable: true })
    video?: string;

    @Column({ nullable: true })
    model3d?: string; // URL to GLB/GLTF file

    @Column({ nullable: true })
    categoryId?: string;

    @Column({ nullable: true })
    collectionId?: string;

    @Column()
    isPublished: boolean;

    @Column({ type: 'json', default: {} })
    attributes: Record<string, any>;

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
        this.currency = 'USD';
        this.images = [];
        this.attributes = {};
        this.seo = {};
        this.isPublished = false;
        this.createdAt = new Date();
    }
}
