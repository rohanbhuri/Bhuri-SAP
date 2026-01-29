import { ObjectId } from 'typeorm';
export declare class TimesheetEntry {
    _id: ObjectId;
    organizationId: ObjectId;
    employeeId: ObjectId;
    projectId: ObjectId;
    taskId: ObjectId;
    deliverableId: ObjectId;
    date: Date;
    startTime: string;
    endTime: string;
    totalHours: number;
    description: string;
    workType: string;
    status: string;
    approvedBy: ObjectId;
    approvedAt: Date;
    rejectionReason: string;
    billable: boolean;
    hourlyRate: number;
    billingAmount: number;
    invoiced: boolean;
    invoiceId: ObjectId;
    createdAt: Date;
    updatedAt: Date;
    constructor();
}
export declare class Timesheet {
    _id: ObjectId;
    employeeId: ObjectId;
    projectId: ObjectId;
    date: Date;
    hoursWorked: number;
    description: string;
    status: string;
    organizationId: ObjectId;
    createdAt: Date;
    constructor();
}
