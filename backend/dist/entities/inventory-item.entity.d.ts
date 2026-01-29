import { ObjectId } from 'typeorm';
export declare class InventoryItem {
    _id: ObjectId;
    name: string;
    sku: string;
    category: string;
    quantity: number;
    unitPrice: number;
    minStockLevel: number;
    supplier: string;
    status: string;
    organizationId: ObjectId;
    createdAt: Date;
    constructor();
}
