import { ObjectId } from 'typeorm';
export declare class ProjectMilestone {
    _id: ObjectId;
    organizationId: ObjectId;
    projectId: ObjectId;
    name: string;
    description: string;
    dueDate: Date;
    completedDate: Date;
    status: string;
    progress: number;
    deliverableIds: ObjectId[];
    taskIds: ObjectId[];
    billingMilestone: boolean;
    billingAmount: number;
    invoiced: boolean;
    createdAt: Date;
    updatedAt: Date;
    constructor();
}
