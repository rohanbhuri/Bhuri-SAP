import { ObjectId } from 'typeorm';
export declare class ProjectTeamAssignment {
    _id: ObjectId;
    organizationId: ObjectId;
    projectId: ObjectId;
    userId: ObjectId;
    role: string;
    assignedBy: ObjectId;
    assignedDate: Date;
    startDate: Date;
    endDate: Date;
    permissions: string[];
    isActive: boolean;
    createdAt: Date;
    constructor();
}
