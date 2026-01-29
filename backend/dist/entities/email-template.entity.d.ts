import { ObjectId } from 'typeorm';
export declare class EmailTemplate {
    _id: ObjectId;
    name: string;
    subject: string;
    body: string;
    variables: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    constructor();
}
