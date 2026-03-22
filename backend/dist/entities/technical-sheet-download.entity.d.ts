import { ObjectId } from 'typeorm';
export declare class TechnicalSheetDownload {
    _id: ObjectId;
    productId: string;
    productCode: string;
    productName: string;
    technicalSheetUrl?: string;
    email: string;
    ipAddress: string;
    userAgent?: string;
    referrer?: string;
    downloadedAt: Date;
}
