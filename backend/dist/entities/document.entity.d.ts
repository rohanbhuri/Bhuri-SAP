import { ObjectId } from 'typeorm';
export declare class DocumentFile {
    _id: ObjectId;
    filename: string;
    length: number;
    chunkSize: number;
    uploadDate: Date;
    contentType?: string;
    metadata?: any;
}
export declare class DocumentChunk {
    _id: ObjectId;
    files_id: ObjectId;
    n: number;
    data: Buffer;
}
export declare class DocumentRecord {
    _id: ObjectId;
    name: string;
    fileId: string;
    employeeId: ObjectId;
    type?: string;
    organizationId: ObjectId;
    createdAt: Date;
    constructor();
}
