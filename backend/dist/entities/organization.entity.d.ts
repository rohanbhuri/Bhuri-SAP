import { ObjectId } from 'typeorm';
export declare class Organization {
    _id: ObjectId;
    name: string;
    code: string;
    description: string;
    isPublic: boolean;
    memberCount: number;
    activeModuleIds: ObjectId[];
    createdAt: Date;
    constructor();
}
