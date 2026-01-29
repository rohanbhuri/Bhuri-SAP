import { ObjectId } from 'typeorm';
export declare class Attendance {
    _id: ObjectId;
    employeeId: ObjectId;
    date: Date;
    checkIn?: Date;
    checkOut?: Date;
    totalHours?: number;
    checkInLocation?: {
        latitude: number;
        longitude: number;
        address?: string;
    };
    checkOutLocation?: {
        latitude: number;
        longitude: number;
        address?: string;
    };
    shiftId?: string;
    organizationId: ObjectId;
    createdAt: Date;
    updatedAt?: Date;
    constructor();
}
