import { ObjectId } from 'typeorm';
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
    dimensionConfig: {
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
    };
    variations: Array<{
        _id?: string;
        name: string;
        sku: string;
        material?: string;
        color?: string;
        finish?: string;
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
        priceModifier: number;
        stock?: number;
        isAvailable: boolean;
    }>;
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
