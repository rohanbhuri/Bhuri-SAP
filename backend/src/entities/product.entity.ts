import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity('products')
export class Product {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    name: string;

    @Column()
    productCode: string;

    @Column()
    slug: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ nullable: true })
    descriptionHtml?: string;

    @Column({ type: 'double', default: 0 })
    basePrice: number;

    @Column()
    currency: string;

    // Product-level media (main product images)
    @Column({ nullable: true })
    featuredImage?: string;

    @Column('array')
    imageGallery: string[];

    @Column('array')
    videos: string[];

    @Column('array')
    models3d: string[];

    @Column({ nullable: true })
    categoryId?: string;

    @Column({ nullable: true })
    collectionId?: string;

    @Column('array')
    tags: string[];

    @Column()
    isPublished: boolean;

    // Dimension configuration (flexible for different product types)
    @Column({ type: 'json', default: {} })
    dimensionType: {
        type: 'hwl' | 'hd' | 'custom'; // height-width-length, height-diameter, custom
        unit: 'cm' | 'inch' | 'mm';
    };

    // Product variations (material, color, finish, etc.)
    @Column({ type: 'json', default: [] })
    variations: Array<{
        _id?: string;
        name: string; // e.g., "White Marble with Brass"
        sku: string;
        material?: string; // e.g., "White Marble"
        color?: string; // e.g., "White"
        finish?: string; // e.g., "Brass Lining"
        featuredImage?: string;
        imageGallery: string[];
        dimensions: {
            height?: number;
            width?: number;
            length?: number;
            diameter?: number;
            custom?: Record<string, number>;
        };
        price: number;
        priceModifier: number; // Additional cost from base price
        stock?: number;
        isAvailable: boolean;
    }>;

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
        this.imageGallery = [];
        this.videos = [];
        this.models3d = [];
        this.tags = [];
        this.variations = [];
        this.dimensionType = { type: 'hwl', unit: 'cm' };
        this.attributes = {};
        this.seo = {};
        this.isPublished = false;
        this.createdAt = new Date();
    }
}
