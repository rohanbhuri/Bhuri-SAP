import { ObjectId } from 'typeorm';
export declare class Employee {
    _id: ObjectId;
    employeeId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    department: string;
    position: string;
    salary: number;
    hireDate: Date;
    status: string;
    organizationId: ObjectId;
    managerId: ObjectId;
    createdAt: Date;
    constructor();
}
