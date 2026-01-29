import { ObjectId } from 'typeorm';
export declare class Department {
    _id: ObjectId;
    name: string;
    description: string;
    managerId: ObjectId;
    organizationId: ObjectId;
    createdAt: Date;
    updatedAt: Date;
    constructor();
}
