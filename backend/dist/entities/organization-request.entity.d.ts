import { ObjectId } from 'typeorm';
export declare enum RequestStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected"
}
export declare class OrganizationRequest {
    _id: ObjectId;
    userId: ObjectId;
    organizationId: ObjectId;
    status: RequestStatus;
    requestedAt: Date;
    processedAt?: Date;
    processedBy?: ObjectId;
    reason?: string;
    constructor();
}
