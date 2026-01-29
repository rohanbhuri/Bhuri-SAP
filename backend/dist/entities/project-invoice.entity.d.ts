import { ObjectId } from 'typeorm';
export declare class ProjectInvoice {
    _id: ObjectId;
    organizationId: ObjectId;
    projectId: ObjectId;
    clientId: ObjectId;
    invoiceNumber: string;
    invoiceDate: Date;
    dueDate: Date;
    items: {
        type: string;
        description: string;
        quantity: number;
        rate: number;
        amount: number;
        timesheetEntryIds?: ObjectId[];
        milestoneId?: ObjectId;
    }[];
    subtotal: number;
    tax: number;
    total: number;
    status: string;
    paidDate: Date;
    createdAt: Date;
    updatedAt: Date;
    constructor();
}
