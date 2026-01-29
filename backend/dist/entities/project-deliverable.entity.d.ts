import { ObjectId } from 'typeorm';
export declare class ProjectDeliverable {
    _id: ObjectId;
    organizationId: ObjectId;
    projectId: ObjectId;
    name: string;
    description: string;
    type: string;
    status: string;
    progress: number;
    assignedTo: ObjectId;
    reviewerId: ObjectId;
    dueDate: Date;
    completedDate: Date;
    dependencies: ObjectId[];
    attachments: {
        name: string;
        url: string;
        type: string;
        uploadedAt: Date;
    }[];
    billable: boolean;
    estimatedHours: number;
    actualHours: number;
    createdAt: Date;
    updatedAt: Date;
    constructor();
}
