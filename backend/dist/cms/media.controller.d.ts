import { Response } from 'express';
export declare class MediaController {
    uploadFile(file: Express.Multer.File): Promise<{
        url: string;
        filename: string;
        mimetype: string;
        size: number;
    }>;
    serveFile(filename: string, res: Response): void;
}
