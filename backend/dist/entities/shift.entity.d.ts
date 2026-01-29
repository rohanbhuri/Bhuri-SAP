import { ObjectId } from 'typeorm';
export declare class Shift {
    _id: ObjectId;
    name: string;
    startTime: string;
    endTime: string;
    daysOfWeek?: number[];
    organizationId: ObjectId;
    createdAt: Date;
    updatedAt?: Date;
    constructor();
}
