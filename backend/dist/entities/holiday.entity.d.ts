import { ObjectId } from 'typeorm';
export declare class Holiday {
    _id: ObjectId;
    name: string;
    date: Date;
    organizationId: ObjectId;
    createdAt: Date;
    constructor();
}
