import { MongoRepository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Collection } from '../entities/collection.entity';
import { Designer } from '../entities/designer.entity';
import { Enquiry } from '../entities/enquiry.entity';
import { TechnicalSheetDownload } from '../entities/technical-sheet-download.entity';
export declare class CatalogueService {
    private productRepository;
    private categoryRepository;
    private collectionRepository;
    private designerRepository;
    private enquiryRepository;
    private technicalSheetDownloadRepository;
    constructor(productRepository: MongoRepository<Product>, categoryRepository: MongoRepository<Category>, collectionRepository: MongoRepository<Collection>, designerRepository: MongoRepository<Designer>, enquiryRepository: MongoRepository<Enquiry>, technicalSheetDownloadRepository: MongoRepository<TechnicalSheetDownload>);
    findAllProducts(query?: {
        page?: number;
        limit?: number;
        search?: string;
        categoryId?: string;
        collectionId?: string;
        designerId?: string;
        isExclusive?: string | boolean;
        isFeatured?: string | boolean;
        isPublished?: string | boolean;
    }): Promise<{
        items: Product[];
        total: number;
    }>;
    checkProductCodeExists(productCode: string, excludeId?: string): Promise<boolean>;
    findOneProduct(id: string): Promise<Product>;
    createProduct(data: Partial<Product>, userId?: string): Promise<Product>;
    updateProduct(id: string, data: Partial<Product>, userId?: string): Promise<Product>;
    deleteProduct(id: string, userId?: string): Promise<void>;
    private validateVariations;
    findAllCategories(): Promise<Category[]>;
    findOneCategory(id: string): Promise<Category>;
    createCategory(data: Partial<Category>, userId?: string): Promise<Category>;
    updateCategory(id: string, data: Partial<Category>, userId?: string): Promise<Category>;
    deleteCategory(id: string, userId?: string): Promise<void>;
    findAllCollections(): Promise<Collection[]>;
    findOneCollection(id: string): Promise<Collection>;
    createCollection(data: Partial<Collection>, userId?: string): Promise<Collection>;
    updateCollection(id: string, data: Partial<Collection>, userId?: string): Promise<Collection>;
    deleteCollection(id: string, userId?: string): Promise<void>;
    findAllDesigners(): Promise<Designer[]>;
    findOneDesigner(id: string): Promise<Designer>;
    createDesigner(data: Partial<Designer>, userId?: string): Promise<Designer>;
    updateDesigner(id: string, data: Partial<Designer>, userId?: string): Promise<Designer>;
    deleteDesigner(id: string, userId?: string): Promise<void>;
    getAnalytics(): Promise<{
        totalProducts: number;
        publishedProducts: number;
        totalCategories: number;
        activeCategories: number;
        totalCollections: number;
        activeCollections: number;
        totalDesigners: number;
        activeDesigners: number;
        totalVariations: any;
        avgVariationsPerProduct: string | number;
        productsByCategory: {
            id: string;
            name: any;
            count: unknown;
        }[];
        productsByCollection: {
            id: string;
            name: any;
            count: unknown;
        }[];
        popularProducts: {
            id: any;
            name: any;
            count: any;
        }[];
        priceRange: {
            min: number;
            avg: string | number;
            max: number;
        };
        mediaAssets: {
            images: number;
            videos: number;
            models3d: number;
        };
        recentChanges: {
            products: number;
            categories: number;
            collections: number;
            designers: number;
        };
    }>;
    exportProductsCSV(query?: {
        search?: string;
        categoryId?: string;
        collectionId?: string;
        designerId?: string;
        isExclusive?: string | boolean;
        isFeatured?: string | boolean;
        isPublished?: string | boolean;
    }): Promise<string>;
    exportCategoriesCSV(): Promise<string>;
    exportDesignersCSV(): Promise<string>;
    exportCollectionsCSV(): Promise<string>;
    exportAllZIP(): Promise<Buffer>;
    getProductTemplate(): Promise<string>;
    private parseCSVContent;
    validateProductsFromCSV(csvContent: string): Promise<{
        totalRows: number;
        toAdd: number;
        toUpdate: number;
        errors: string[];
    }>;
    importProductsFromCSV(csvContent: string, userId?: string): Promise<{
        success: number;
        failed: number;
        errors: string[];
    }>;
    trackTechnicalSheetDownload(productId: string, email: string, ipAddress: string, userAgent?: string, referrer?: string): Promise<TechnicalSheetDownload>;
    getTechnicalSheetDownloads(productId: string): Promise<TechnicalSheetDownload[]>;
    getAllTechnicalSheetDownloads(): Promise<TechnicalSheetDownload[]>;
    getTechnicalSheetDownloadStats(productId?: string): Promise<any>;
}
