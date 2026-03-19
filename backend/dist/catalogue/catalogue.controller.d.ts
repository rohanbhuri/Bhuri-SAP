import { Response } from 'express';
import { CatalogueService } from './catalogue.service';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Collection } from '../entities/collection.entity';
import { Designer } from '../entities/designer.entity';
export declare class CatalogueController {
    private readonly catalogueService;
    constructor(catalogueService: CatalogueService);
    getAllProducts(query: any): Promise<{
        items: Product[];
        total: number;
    }>;
    checkProductCode(code: string, excludeId?: string): Promise<{
        exists: boolean;
    }>;
    getProduct(id: string): Promise<Product>;
    createProduct(data: Partial<Product>, req: any): Promise<Product>;
    uploadImages(files: Express.Multer.File[]): Promise<{
        urls: string[];
    }>;
    uploadFile(file: Express.Multer.File): Promise<{
        url: string;
    }>;
    uploadVideo(file: Express.Multer.File): Promise<{
        url: string;
    }>;
    uploadModel(file: Express.Multer.File): Promise<{
        url: string;
    }>;
    uploadTechnicalSheet(file: Express.Multer.File): Promise<{
        url: string;
    }>;
    trackTechnicalSheetDownload(productId: string, data: {
        email: string;
    }, req: any): Promise<import("../entities/technical-sheet-download.entity").TechnicalSheetDownload>;
    getTechnicalSheetDownloads(productId: string): Promise<import("../entities/technical-sheet-download.entity").TechnicalSheetDownload[]>;
    getAllTechnicalSheetDownloads(): Promise<import("../entities/technical-sheet-download.entity").TechnicalSheetDownload[]>;
    updateProduct(id: string, data: Partial<Product>, req: any): Promise<Product>;
    deleteProduct(id: string, req: any): Promise<void>;
    getAllCategories(): Promise<Category[]>;
    getCategory(id: string): Promise<Category>;
    createCategory(data: Partial<Category>, req: any): Promise<Category>;
    uploadCategoryImage(file: Express.Multer.File): Promise<{
        url: string;
    }>;
    updateCategory(id: string, data: Partial<Category>, req: any): Promise<Category>;
    deleteCategory(id: string, req: any): Promise<void>;
    getAllCollections(): Promise<Collection[]>;
    getCollection(id: string): Promise<Collection>;
    createCollection(data: Partial<Collection>, req: any): Promise<Collection>;
    uploadCollectionImage(file: Express.Multer.File): Promise<{
        url: string;
    }>;
    updateCollection(id: string, data: Partial<Collection>, req: any): Promise<Collection>;
    deleteCollection(id: string, req: any): Promise<void>;
    getAllDesigners(): Promise<Designer[]>;
    getDesigner(id: string): Promise<Designer>;
    createDesigner(data: Partial<Designer>, req: any): Promise<Designer>;
    uploadDesignerProfile(file: Express.Multer.File): Promise<{
        url: string;
    }>;
    uploadDesignerPortfolio(files: Express.Multer.File[]): Promise<{
        urls: string[];
    }>;
    updateDesigner(id: string, data: Partial<Designer>, req: any): Promise<Designer>;
    deleteDesigner(id: string, req: any): Promise<void>;
    getAnalytics(): Promise<{
        totalProducts: number;
        publishedProducts: number;
        totalCategories: number;
        activeCategories: number;
        totalCollections: number;
        activeCollections: number;
        totalDesigners: number;
        activeDesigners: number;
        totalVariations: number;
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
    exportProducts(res: Response, query: any): Promise<void>;
    exportCategories(res: Response): Promise<void>;
    exportCollections(res: Response): Promise<void>;
    exportDesigners(res: Response): Promise<void>;
    exportAll(res: Response): Promise<void>;
    downloadProductTemplate(res: Response): Promise<void>;
    validateImport(file: Express.Multer.File): Promise<{
        totalRows: number;
        toAdd: number;
        toUpdate: number;
        errors: string[];
    }>;
    importProducts(file: Express.Multer.File, req: any): Promise<{
        success: number;
        failed: number;
        errors: string[];
    }>;
}
