import { ObjectId } from 'typeorm';
export declare enum ModuleRequestStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected"
}
export declare class ModuleRequest {
    _id: ObjectId;
    moduleId: ObjectId;
    userId: ObjectId;
    organizationId: ObjectId;
    status: ModuleRequestStatus;
    requestedAt: Date;
    processedAt?: Date;
    processedBy?: ObjectId;
    constructor();
}
