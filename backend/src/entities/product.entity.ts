import { Entity, ObjectIdColumn, ObjectId, Column, Index } from 'typeorm';

// Allowed variation type names
export type VariationTypeName = 'material' | 'finish' | 'size';

export const VARIATION_TYPE_NAMES: VariationTypeName[] = ['material', 'finish', 'size'];

// Dimension config shared between product and variants
export interface DimensionConfig {
    shape: 'rectangle' | 'round';
    unit: 'cm' | 'inch' | 'mm';
    width?: { min: number; max: number; default: number };
    height?: number;
    depth?: number;
    diameter?: { min: number; max: number; default: number };
}

// A single variant under a variation type
export interface ProductVariant {
    _id: string;
    name: string;              // e.g., "White Marble", "Extended"
    sku: string;               // unique SKU for this variant
    description?: string;
    descriptionHtml?: string;
    price: number;             // final price for this variant
    priceModifier: number;     // delta from base price
    featuredImage?: string;
    imageGallery: string[];
    videos: string[];
    models3d: string[];
    technicalSheet?: string;
    dimensionConfig?: DimensionConfig; // null/undefined = inherit from product
    isAvailable: boolean;
}

// A variation type containing its variants
export interface ProductVariationType {
    typeName: VariationTypeName;
    variants: ProductVariant[];
}

@Entity('products')
@Index('idx_product_code', ['productCode'], { unique: true })
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
    technicalSheet?: string;

    @Column({ nullable: true })
    categoryId?: string;

    @Column({ nullable: true })
    collectionId?: string;

    @Column({ nullable: true })
    designerId?: string;

    @Column('array')
    tags: string[];

    @Column()
    isPublished: boolean;

    @Column({ default: false })
    isExclusive: boolean;

    @Column({ default: false })
    isFeatured: boolean;

    // Dimension configuration (flexible for different product types)
    @Column({ type: 'json', default: {} })
    dimensionConfig: DimensionConfig;

    // Product variations grouped by type (material, finish, size)
    @Column({ type: 'json', default: [] })
    variations: ProductVariationType[];

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
        this.currency = 'INR';
        this.imageGallery = [];
        this.videos = [];
        this.models3d = [];
        this.tags = [];
        this.variations = [];
        this.dimensionConfig = { shape: 'rectangle', unit: 'cm' };
        this.attributes = {};
        this.seo = {};
        this.isPublished = false;
        this.isExclusive = false;
        this.isFeatured = false;
        this.createdAt = new Date();
        this.changeLog = [];
    }
}
