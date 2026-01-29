import { ObjectId } from 'typeorm';
export type ReviewCycleStatus = 'draft' | 'active' | 'closed';
export declare class Goal {
    _id: ObjectId;
    employeeId: ObjectId;
    title: string;
    description?: string;
    progress: number;
    organizationId: ObjectId;
    createdAt: Date;
    updatedAt?: Date;
    constructor();
}
export declare class ReviewCycle {
    _id: ObjectId;
    name: string;
    status: ReviewCycleStatus;
    startDate: Date;
    endDate: Date;
    organizationId: ObjectId;
    createdAt: Date;
    constructor();
}
export declare class Feedback {
    _id: ObjectId;
    reviewCycleId: ObjectId;
    employeeId: ObjectId;
    reviewerId: ObjectId;
    type: 'peer' | 'manager' | 'self';
    rating: number;
    comments?: string;
    organizationId: ObjectId;
    createdAt: Date;
    constructor();
}
