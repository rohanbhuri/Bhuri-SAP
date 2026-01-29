import { ObjectId } from 'typeorm';
export declare enum ActionType {
    READ = "read",
    CREATE = "create",
    UPDATE = "update",
    DELETE = "delete"
}
export declare class Permission {
    _id: ObjectId;
    module: string;
    action: ActionType;
    resource: string;
    description?: string;
    createdAt: Date;
    isDeleted: boolean;
    deletedAt: Date;
    deletedBy: string;
    changeLog: Array<{
        userId: string;
        action: string;
        timestamp: Date;
        details?: string;
    }>;
    constructor();
}
