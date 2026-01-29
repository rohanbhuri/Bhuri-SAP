import { ObjectId } from 'typeorm';
export declare class Asset {
    _id: ObjectId;
    name: string;
    serialNumber?: string;
    category?: string;
    organizationId: ObjectId;
    createdAt: Date;
    constructor();
}
export declare class AssetAssignment {
    _id: ObjectId;
    assetId: ObjectId;
    employeeId: ObjectId;
    assignedAt: Date;
    returnedAt?: Date;
    organizationId: ObjectId;
    constructor();
}
