import { ObjectId } from 'typeorm';
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';
export declare class LeaveRequest {
    _id: ObjectId;
    employeeId: ObjectId;
    startDate: Date;
    endDate: Date;
    leaveType: string;
    status: LeaveStatus;
    reason?: string;
    approverId?: string;
    organizationId: ObjectId;
    createdAt: Date;
    updatedAt?: Date;
    constructor();
}
