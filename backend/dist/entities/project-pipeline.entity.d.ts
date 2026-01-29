import { ObjectId } from 'typeorm';
export declare class ProjectPipeline {
    _id: ObjectId;
    organizationId: ObjectId;
    name: string;
    description: string;
    stages: {
        name: string;
        order: number;
        color: string;
        requirements: string[];
        autoTransition: boolean;
        transitionConditions: any;
    }[];
    isDefault: boolean;
    isActive: boolean;
    createdAt: Date;
    constructor();
}
