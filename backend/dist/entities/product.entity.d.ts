import { ObjectId } from 'typeorm';
export type VariationTypeName = 'material' | 'finish' | 'size';
export declare const VARIATION_TYPE_NAMES: VariationTypeName[];
export interface DimensionConfig {
    shape: 'rectangle' | 'round';
    unit: 'cm' | 'inch' | 'mm';
    width?: {
        min: number;
        max: number;
        default: number;
    };
    height?: number;
    depth?: number;
    diameter?: {
        min: number;
        max: number;
        default: number;
    };
}
export interface ProductVariant {
    _id: string;
    name: string;
    sku: string;
    description?: string;
    descriptionHtml?: string;
    price: number;
    priceModifier: number;
    featuredImage?: string;
    imageGallery: string[];
    videos: string[];
    models3d: string[];
    technicalSheet?: string;
    dimensionConfig?: DimensionConfig;
    isAvailable: boolean;
}
export interface ProductVariationType {
    typeName: VariationTypeName;
    variants: ProductVariant[];
}
export declare class Product {
    _id: ObjectId;
    name: string;
    productCode: string;
    slug: string;
    description?: string;
    descriptionHtml?: string;
    basePrice: number;
    currency: string;
    featuredImage?: string;
    imageGallery: string[];
    videos: string[];
    models3d: string[];
    technicalSheet?: string;
    categoryId?: string;
    collectionId?: string;
    designerId?: string;
    tags: string[];
    isPublished: boolean;
    isExclusive: boolean;
    isFeatured: boolean;
    dimensionConfig: DimensionConfig;
    variations: ProductVariationType[];
    attributes: Record<string, any>;
    seo: {
        title?: string;
        description?: string;
        keywords?: string;
    };
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
    updatedBy?: string;
    changeLog: Array<{
        userId: string;
        action: string;
        timestamp: Date;
        details?: string;
    }>;
    isDeleted: boolean;
    deletedAt: Date;
    deletedBy: string;
    constructor();
}
