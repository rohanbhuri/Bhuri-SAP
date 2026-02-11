import { Response } from 'express';
export declare class MediaController {
    private ensureDirectoryExists;
    private getStorageConfig;
    private fileFilter;
    uploadFile(file: Express.Multer.File): Promise<{
        url: string;
        filename: string;
        mimetype: string;
        size: number;
    }>;
    uploadBlogFeaturedImage(file: Express.Multer.File): Promise<{
        url: string;
        filename: string;
        mimetype: string;
        size: number;
    }>;
    uploadBlogGallery(files: Express.Multer.File[]): Promise<{
        files: {
            url: string;
            filename: string;
            mimetype: string;
            size: number;
            order: number;
        }[];
        count: number;
    }>;
    uploadNewsFeaturedImage(file: Express.Multer.File): Promise<{
        url: string;
        filename: string;
        mimetype: string;
        size: number;
    }>;
    uploadNewsGallery(files: Express.Multer.File[]): Promise<{
        files: {
            url: string;
            filename: string;
            mimetype: string;
            size: number;
            order: number;
        }[];
        count: number;
    }>;
    serveFile(filename: string, res: Response): void;
    serveBlogFile(filename: string, res: Response): void;
    serveNewsFile(filename: string, res: Response): void;
}
