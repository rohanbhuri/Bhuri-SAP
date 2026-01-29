import { ObjectId } from 'typeorm';
export declare class ComplianceItem {
    _id: ObjectId;
    name: string;
    description?: string;
    active: boolean;
    organizationId: ObjectId;
    createdAt: Date;
    constructor();
}
export declare class ComplianceEvent {
    _id: ObjectId;
    itemId: ObjectId;
    dueDate: Date;
    completedAt?: Date;
    status: 'pending' | 'completed' | 'overdue';
    notes?: string;
    organizationId: ObjectId;
    createdAt: Date;
    constructor();
}
export declare class AuditLog {
    _id: ObjectId;
    userId: ObjectId;
    action: string;
    entity?: string;
    entityId?: string;
    timestamp: Date;
    organizationId: ObjectId;
    constructor();
}
