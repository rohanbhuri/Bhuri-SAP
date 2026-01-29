import { ObjectId } from 'typeorm';
export declare class LeadToProjectConversion {
    _id: ObjectId;
    organizationId: ObjectId;
    leadId: ObjectId;
    projectId: ObjectId;
    convertedBy: ObjectId;
    conversionDate: Date;
    conversionReason: string;
    leadValue: number;
    projectBudget: number;
    estimatedDuration: number;
    status: string;
    createdAt: Date;
    constructor();
}
